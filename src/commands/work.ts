import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const cooldown = await client.economy.getCooldown(interaction.user.id, interaction.guildId);
    if (cooldown.work > Date.now() / 1000) {
        const embed = new Embed(client, interaction.locale)
            .setLocaleTitle('WORK_COOLDOWN')
            .setLocaleDescription('WORK_COOLDOWN_DESCRIPTION', {
                time: `<t:${cooldown.work}:R>`
            });
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const random = Math.floor(Math.random() * 3);
    const money = Math.floor(Math.random() * 150 + 50);
    const description = client.i18n.t(`WORK_SUCCESS_DESCRIPTION.${random}`, {
        lng: interaction.locale,
        amount: `${money} ${await client.economy.getCurrency(interaction.guildId)}`
    });
    const embed = new Embed(client, interaction.locale).setLocaleTitle('WORK_SUCCESS').setDescription(description);
    client.economy.add(interaction.user.id, interaction.guild.id, money);
    client.economy.setCooldown(interaction.user.id, interaction.guild.id, {
        work: Math.round(Date.now() / 1000 + 1800)
    });
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder().setName('work').setDescription('Get money from working!');
export const category: Category = 'economy';
