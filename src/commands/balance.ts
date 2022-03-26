import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const balance = await client.economy.get(interaction.guild, interaction.user);
    const currency = await client.economy.getCurrency(interaction.guild);

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('BALANCE')
        .addLocaleField({
            name: 'BALANCE_WALLET',
            value: `${balance.wallet_bal} ${currency}`
        })
        .addLocaleField({
            name: 'BALANCE_BANK',
            value: `${balance.bank_bal} ${currency}`
        });

    interaction.reply({ embeds: [embed], ephemeral: true });
}

export const data = new SlashCommandBuilder().setName('balance').setDescription('Check your balance');
export const category: Category = 'economy';
