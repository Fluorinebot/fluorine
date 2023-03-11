import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const money = Math.floor(Math.random() * 200 + 50);
    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('SLUT_SUCCESS')
        .setDescription('SLUT_SUCCESS_DESCRIPTION', {
            amount: `${money} ${await client.economy.getCurrency(interaction.guildId)}`
        });

    client.economy.add(interaction.guildId, interaction.user, money);
    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('SLUT').setDMPermission(false);
export const category: Category = 'economy';
export const cooldown = 1 * 60 * 60 * 1000;
