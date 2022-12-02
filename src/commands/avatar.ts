import { type FluorineClient, Embed } from '#classes';
import type { ComponentData, Category } from '#types';
import {
    type ChatInputCommandInteraction,
    GuildMember,
    type InteractionReplyOptions,
    SlashCommandBuilder,
    type ButtonInteraction,
    type ContextMenuCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    type User,
    ContextMenuCommandBuilder,
    ApplicationCommandType
} from 'discord.js';

function createComponents(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction | ButtonInteraction | ContextMenuCommandInteraction,
    member: GuildMember,
    action: 'guild' | 'user'
) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`navatar:${interaction.user.id}:${member.id}.guild`)
            .setLabel(client.i18n.t('AVATAR_GUILD', { lng: interaction.locale }))
            .setStyle(ButtonStyle.Primary)
            .setDisabled(action === 'guild'),
        new ButtonBuilder()
            .setCustomId(`navatar:${interaction.user.id}:${member.id}.user`)
            .setLabel(client.i18n.t('AVATAR_USER', { lng: interaction.locale }))
            .setStyle(ButtonStyle.Primary)
            .setDisabled(action === 'user')
    );
}

function createEmbed(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction | ButtonInteraction | ContextMenuCommandInteraction,
    member: GuildMember | User,
    action: 'guild' | 'user'
) {
    const embed = new Embed(client, interaction.locale).setLocaleTitle('AVATAR');

    if (member instanceof GuildMember) {
        switch (action) {
            case 'guild': {
                embed.setImage(member.displayAvatarURL({ size: 512 }));
                break;
            }

            case 'user': {
                embed.setImage(member.user.displayAvatarURL({ size: 512 }));
                break;
            }
        }
    } else {
        embed.setImage(member.displayAvatarURL({ size: 512 }));
    }

    return embed;
}

export async function onCommand(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction<'cached'> | ContextMenuCommandInteraction<'cached'>
) {
    const user = interaction.options.getMember('user') ?? interaction.options.getUser('user') ?? interaction.member;

    const replyOptions: InteractionReplyOptions = {
        embeds: [createEmbed(client, interaction, user, 'guild')]
    };

    if (user instanceof GuildMember && user.avatar) {
        replyOptions.components = [createComponents(client, interaction, user, 'guild')];
    }

    interaction.reply(replyOptions);
}

export async function onComponent(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    const [memberId, action] = value.split('.');
    const member = await interaction.guild.members.fetch(memberId);

    interaction.update({
        components: [createComponents(client, interaction, member, action as 'guild' | 'user')],
        embeds: [createEmbed(client, interaction, member, action as 'guild' | 'user')]
    });
}

export const slashCommandData = new SlashCommandBuilder()
    .setName('avatar')
    .setNameLocalizations({ pl: 'avatar' })
    .setDescription('Show avatar of a user')
    .setDescriptionLocalizations({ pl: 'Wyświetla avatar użytkownika' })
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'użytkownik' })
            .setDescription('Select a user')
            .setDescriptionLocalizations({ pl: 'Wybierz użytkownika' })
            .setRequired(false)
    );

export const contextMenuCommandData = new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setType(ApplicationCommandType.User);

export const componentData: ComponentData = {
    authorOnly: false,
    exists: true,
    name: 'navatar'
};

export const category: Category = 'tools';
