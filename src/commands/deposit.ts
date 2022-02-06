import FluorineClient from '@classes/Client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/applicationCommand';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const toDeposit = interaction.options.getInteger('amount');
    const balance = await client.economy.get(
        interaction.user.id,
        interaction.guildId
    );
    if (balance.wallet < toDeposit) {
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
            amount: `${toDeposit} ${await client.economy.getCurrency(
                interaction.guildId
            )}`
        })
    );
    await client.economy.deposit(
        interaction.user.id,
        interaction.guild.id,
        toDeposit
    );
}
export const data = new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit your money')
    .addIntegerOption(option =>
        option
            .setName('amount')
            .setDescription('Amount of money to deposit')
            .setMinValue(1)
            .setRequired(true)
    );
export const category: Category = 'economy';
