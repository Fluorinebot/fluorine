import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('SUPPORT_TITLE')
        .setDescription('SUPPORT_DESCRIPTION', { link: client.support });

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('SUPPORT');
export const category: Category = 'tools';
