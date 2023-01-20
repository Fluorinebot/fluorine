import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder(client, interaction.locale).setTitle('SERVER_INFO').addFields(
        {
            name: 'SERVER_INFO_NAME',
            rawValue: interaction.guild.name
        },
        {
            name: 'SERVER_INFO_CREATED',
            rawValue: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}>`
        },
        {
            name: 'SERVER_INFO_MEMBERS',
            rawValue: `${interaction.guild.memberCount}`
        },
        {
            name: 'SERVER_INFO_CHANNELS',
            rawValue: `${interaction.guild.channels.cache.size}`
        },
        {
            name: 'SERVER_INFO_ROLES',
            rawValue: `${interaction.guild.roles.cache.size}`
        }
    );

    interaction.reply({ embeds: [embed.builder] });
}

export const slashCommandData = new SlashCommandBuilder('SERVERINFO').setDMPermission(false);
export const category: Category = 'tools';
