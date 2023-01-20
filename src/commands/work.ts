import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const random = Math.floor(Math.random() * 3);
    const money = Math.floor(Math.random() * 150 + 50);

    const description = client.i18n.t(`WORK_SUCCESS_DESCRIPTION.${random}`, {
        lng: interaction.locale,
        amount: `${money} ${await client.economy.getCurrency(interaction.guildId)}`
    });

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('WORK_SUCCESS')
        .setDescription(description, { raw: true });

    client.economy.add(interaction.guildId, interaction.user, money);
    interaction.reply({ embeds: [embed.builder] });
}

export const slashCommandData = new SlashCommandBuilder('WORK').setDMPermission(false);
export const category: Category = 'economy';
export const cooldown = 30 * 60 * 1000;
