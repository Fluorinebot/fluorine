import { SlashCommandBuilder, ContextMenuCommandBuilder, ActionRowBuilder, ButtonBuilder } from '#builders';
import { type FluorineClient, Embed } from '#classes';
import type { ComponentData, Category } from '#types';
import {
    type ChatInputCommandInteraction,
    GuildMember,
    type InteractionReplyOptions,
    type ButtonInteraction,
    type ContextMenuCommandInteraction,
    ButtonStyle,
    type User,
    ApplicationCommandType
} from 'discord.js';

function createComponents(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction | ButtonInteraction | ContextMenuCommandInteraction,
    member: GuildMember,
    action: 'guild' | 'user'
) {
    return new ActionRowBuilder(interaction.locale).addComponents(
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

function createEmbed(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction | ButtonInteraction | ContextMenuCommandInteraction,
    member: GuildMember | User,
    action: 'guild' | 'user'
) {
    const embed = new EmbedBuilder(client, interaction.locale).setTitle('AVATAR');

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

export const slashCommandData = new SlashCommandBuilder('AVATAR').addUserOption('USER');
export const contextMenuCommandData = new ContextMenuCommandBuilder(ApplicationCommandType.User, 'AVATAR');

export const componentData: ComponentData = {
    authorOnly: false,
    exists: true,
    name: 'avatar'
};

export const category: Category = 'tools';
