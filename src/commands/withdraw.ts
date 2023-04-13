import { SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const toWithdraw = interaction.options.getInteger('amount');
    const balance = await client.economy.get(interaction.guildId, interaction.user);

    if (balance.bankBal < toWithdraw) {
        return interaction.reply({
            content: client.i18n.t('WITHDRAW_NOT_ENOUGH', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    interaction.reply(
        client.i18n.t('WITHDRAW_SUCCESS', {
            lng: interaction.locale,
            amount: `${toWithdraw} ${await client.economy.getCurrency(interaction.guildId)}`
        })
    );

    await client.economy.withdraw(interaction.guildId, interaction.user, toWithdraw);
}

export const slashCommandData = new SlashCommandBuilder('WITHDRAW')
    .setDMPermission(false)
    .addIntegerOption('AMOUNT', (option) => option.setMinValue(1).setRequired(true));

export const category: Category = 'economy';
