import FluorineClient from '@classes/Client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/structures';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const toDeposit = interaction.options.getInteger('amount');
    const balance = await client.economy.get(interaction.guildId, interaction.user);

    if (balance.wallet_bal < toDeposit) {
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

export const data = new SlashCommandBuilder()
    .setName('deposit')
    .setNameLocalizations({ pl: 'wpłać' })
    .setDescription('Deposit your money')
    .setDescriptionLocalizations({ pl: 'Wpłać swoje pieniądze' })
    .addIntegerOption(option =>
        option
            .setName('amount')
            .setNameLocalizations({ pl: 'ilość' })
            .setDescription('Amount of money to deposit')
            .setDescriptionLocalizations({ pl: 'Ilość pieniędzy, które chcesz wpłacić' })
            .setMinValue(1)
            .setRequired(true)
    );

export const category: Category = 'economy';
