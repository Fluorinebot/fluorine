import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const cooldown = await client.economy.getCooldown(interaction.user.id, interaction.guildId);
    if (cooldown.work > Date.now() / 1000) {
        return interaction.reply(
            client.i18n.t('SLUT_COOLDOWN', {
                lng: interaction.locale,
                time: `<t:${cooldown.slut}:R>`
            })
        );
    }
    const money = Math.floor(Math.random() * 200 + 50);
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('SLUT_SUCCESS')
        .setLocaleDescription('SLUT_SUCCESS_DESCRIPTION', {
            amount: `${money} ${client.economy.getCurrency(interaction.guildId)}`
        });
    client.economy.add(interaction.user.id, interaction.guildId, money);
    client.economy.setCooldown(interaction.user.id, interaction.guildId, {
        slut: Math.round(Date.now() / 1000 + 3600)
    });
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder().setName('slut').setDescription('Get money by being a slut!');
export const category: Category = 'economy';
