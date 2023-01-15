import { SlashCommandBuilder } from '#builders';
import { Embed, type FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const balance = await client.economy.get(interaction.guildId, interaction.user);
    const currency = await client.economy.getCurrency(interaction.guildId);

    const embed = new Embed(client, interaction.locale).setLocaleTitle('BALANCE').addLocaleFields([
        {
            name: 'BALANCE_WALLET',
            value: `${balance.walletBal} ${currency}`
        },
        { name: 'BALANCE_BANK', value: `${balance.bankBal} ${currency}` }
    ]);

    interaction.reply({ embeds: [embed], ephemeral: true });
}

export const slashCommandData = new SlashCommandBuilder('BALANCE').setDMPermission(false);

export const category: Category = 'economy';
