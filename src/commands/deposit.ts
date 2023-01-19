import { SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const toDeposit = interaction.options.getInteger('amount');
    const balance = await client.economy.get(interaction.guildId, interaction.user);

    if (balance.walletBal < toDeposit) {
        return interaction.reply({
            content: client.i18n.t('DEPOSIT_NOT_ENOUGH', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    interaction.reply(
        client.i18n.t('DEPOSIT_SUCCESS', {
            lng: interaction.locale,
            amount: `${toDeposit} ${await client.economy.getCurrency(interaction.guildId)}`
        })
    );

    await client.economy.deposit(interaction.guildId, interaction.user, toDeposit);
}

export const slashCommandData = new SlashCommandBuilder('DEPOSIT')
    .setDMPermission(false)
    .addIntegerOption('AMOUNT', option => option.setMinValue(1).setRequired(true));

export const category: Category = 'economy';
