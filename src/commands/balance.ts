import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const balance = await client.economy.get(interaction.guildId, interaction.user);
    const currency = await client.economy.getCurrency(interaction.guildId);

    const embed = new EmbedBuilder(client, interaction.locale).setTitle('BALANCE').addFields([
        { name: 'BALANCE_WALLET', rawValue: `${balance.walletBal} ${currency}` },
        { name: 'BALANCE_BANK', rawValue: `${balance.bankBal} ${currency}` }
    ]);

    interaction.reply({ embeds: [embed], ephemeral: true });
}

export const slashCommandData = new SlashCommandBuilder('BALANCE').setDMPermission(false);
export const category: Category = 'economy';
