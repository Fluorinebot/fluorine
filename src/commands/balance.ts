import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const balance = await client.economy.get(
        interaction.user.id,
        interaction.guild.id
    );
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('BALANCE')
        .addLocaleField({
            name: 'BALANCE_WALLET',
            value: `${balance.wallet.toString()} 🪙`
        })
        .addLocaleField({
            name: 'BALANCE_BANK',
            value: `${balance.bank.toString()} 🪙`
        });
    interaction.reply({ embeds: [embed] });
}
export const data = new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance');
export const category: Category = 'economy';
