import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const balance = await client.economy.get(interaction.user.id, interaction.guildId);
    const currency = await client.economy.getCurrency(interaction.guildId);
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('BALANCE')
        .addLocaleField({
            name: 'BALANCE_WALLET',
            value: `${balance.wallet} ${currency}`
        })
        .addLocaleField({
            name: 'BALANCE_BANK',
            value: `${balance.bank} ${currency}`
        });
    interaction.reply({ embeds: [embed], ephemeral: true });
}
export const data = new SlashCommandBuilder().setName('balance').setDescription('Check your balance');
export const category: Category = 'economy';
