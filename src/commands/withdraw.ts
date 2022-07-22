import FluorineClient from '#classes/Client';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Category } from '#types/structures';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
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

export const data = new SlashCommandBuilder()
    .setName('withdraw')
    .setNameLocalizations({ pl: 'wypłać' })
    .setDescription('Withdraw your money')
    .setDescriptionLocalizations({ pl: 'Wypłać pieniądze' })
    .setDMPermission(false)
    .addIntegerOption(option =>
        option
            .setName('amount')
            .setNameLocalizations({ pl: 'ilość' })
            .setDescription('Amount of money to withdraw')
            .setDescriptionLocalizations({ pl: 'Ilość pieniędzy do wypłaty' })
            .setMinValue(1)
            .setRequired(true)
    );

export const category: Category = 'economy';
