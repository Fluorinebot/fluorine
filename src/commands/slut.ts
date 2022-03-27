import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const money = Math.floor(Math.random() * 200 + 50);
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('SLUT_SUCCESS')
        .setLocaleDescription('SLUT_SUCCESS_DESCRIPTION', {
            amount: `${money} ${client.economy.getCurrency(interaction.guildId)}`
        });

    client.economy.add(interaction.guildId, interaction.user, money);
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder().setName('slut').setDescription('Get money by being a slut!');
export const category: Category = 'economy';
export const cooldown = 216000000;
