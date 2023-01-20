import { SlashCommandBuilder } from '#builders';
import { Embed, type FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('SUPPORT_TITLE')
        .setLocaleDescription('SUPPORT_DESCRIPTION', { link: client.support });
    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('SUPPORT');
export const category: Category = 'tools';
