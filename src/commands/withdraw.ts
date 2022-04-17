import FluorineClient from '@classes/Client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/structures';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const toWithdraw = interaction.options.getInteger('amount');
    const balance = await client.economy.get(interaction.guildId, interaction.user);

    if (balance.bank_bal < toWithdraw) {
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
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Withdraw your money')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addIntegerOption(option =>
        option
            .setName('amount')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Amount of money to withdraw')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setMinValue(1)
            .setRequired(true)
    );

export const category: Category = 'economy';
