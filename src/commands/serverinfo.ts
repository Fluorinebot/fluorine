import { SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder(client, interaction.locale).setTitle('SERVER_INFO').addFields([
        {
            name: 'SERVER_INFO_NAME',
            value: interaction.guild.name
        },
        {
            name: 'SERVER_INFO_CREATED',
            value: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}>`
        },
        {
            name: 'SERVER_INFO_MEMBERS',
            value: `${interaction.guild.memberCount}`
        },
        {
            name: 'SERVER_INFO_CHANNELS',
            value: `${interaction.guild.channels.cache.size}`
        },
        {
            name: 'SERVER_INFO_ROLES',
            value: `${interaction.guild.roles.cache.size}`
        }
    ]);
    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('SERVERINFO').setDMPermission(false);
export const category: Category = 'tools';
