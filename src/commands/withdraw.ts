import FluorineClient from '@classes/Client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/applicationCommand';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const toWithdraw = interaction.options.getInteger('amount');
    const balance = await client.economy.get(
        interaction.user.id,
        interaction.guildId
    );
    if (balance.wallet > toWithdraw) {
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
            amount: `${toWithdraw} ${await client.economy.getCurrency(
                interaction.guildId
            )}`
        })
    );
    await client.economy.withdraw(
        interaction.user.id,
        interaction.guildId,
        toWithdraw
    );
}
export const data = new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw your money')
    .addIntegerOption(option =>
        option
            .setName('amount')
            .setDescription('Amount of money to withdraw')
            .setMinValue(1)
            .setRequired(true)
    );
export const category: Category = 'economy';
