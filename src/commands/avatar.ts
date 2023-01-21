import {
    ActionRowBuilder,
    ButtonBuilder,
    ContextMenuCommandBuilder,
    EmbedBuilder,
    SlashCommandBuilder
} from '#builders';
import type { FluorineClient } from '#classes';
import type { Category, ComponentData } from '#types';
import {
    ApplicationCommandType,
    ButtonStyle,
    GuildMember,
    type ButtonInteraction,
    type ChatInputCommandInteraction,
    type ContextMenuCommandInteraction,
    type User
} from 'discord.js';

export async function onInteraction(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | ButtonInteraction,
    value?: string
) {
    let member: GuildMember | User;
    let action: string;

    if (interaction.isContextMenuCommand() || interaction.isChatInputCommand()) {
        member =
            (interaction.options.getMember('user') as unknown as User) ??
            interaction.options.getUser('user') ??
            (interaction.member as GuildMember);

        action = 'guild';
    } else {
        const [memberId, parsedAction] = value.split('.');

        member = await interaction.guild.members.fetch(memberId);
        action = parsedAction;
    }

    const embed = new EmbedBuilder(client, interaction.locale).setTitle('AVATAR');
    const components = new ActionRowBuilder(interaction.locale);

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

        if (member.avatar) {
            components.addComponents(
                new ButtonBuilder(`avatar:${interaction.user.id}:${member.id}.guild`)
                    .setLabel('AVATAR_GUILD')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(action === 'guild'),
                new ButtonBuilder(`avatar:${interaction.user.id}:${member.id}.user`)
                    .setLabel('AVATAR_USER')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(action === 'user')
            );
        }
    } else {
        embed.setImage(member.displayAvatarURL({ size: 512 }));
    }

    const options = { embeds: [embed], components: [components.builder] };
    interaction.isMessageComponent() ? interaction.update(options) : interaction.reply(options);
}

export const slashCommandData = new SlashCommandBuilder('AVATAR').addUserOption('USER');
export const contextMenuCommandData = new ContextMenuCommandBuilder(ApplicationCommandType.User, 'AVATAR');

export const componentData: ComponentData = {
    authorOnly: false,
    exists: true,
    name: 'avatar'
};

export const category: Category = 'tools';
