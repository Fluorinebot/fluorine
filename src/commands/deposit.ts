import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
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

export const data = new SlashCommandBuilder()
    .setName('deposit')
    .setNameLocalizations({ pl: 'wpłać' })
    .setDescription('Deposit your money')
    .setDescriptionLocalizations({ pl: 'Wpłać swoje pieniądze' })
    .setDMPermission(false)
    .addIntegerOption((option) =>
        option
            .setName('amount')
            .setNameLocalizations({ pl: 'ilość' })
            .setDescription('Amount of money to deposit')
            .setDescriptionLocalizations({ pl: 'Ilość pieniędzy, które chcesz wpłacić' })
            .setMinValue(1)
            .setRequired(true)
    );

export const category: Category = 'economy';
