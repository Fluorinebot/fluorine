import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const cooldown = await client.economy.getCooldown(
        interaction.user.id,
        interaction.guild.id
    );
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
    const description = client.language.get(
        interaction.locale,
        'WORK_SUCCESS_DESCRIPTION'
    );
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('WORK_SUCCESS')
        .setDescription(
            description[random].replaceAll(
                '{{- amount }}',
                `${money} ${await client.economy.getCurrency(
                    interaction.guildId
                )}`
            )
        );
    client.economy.add(interaction.user.id, interaction.guild.id, money);
    client.economy.setCooldown(interaction.user.id, interaction.guild.id, {
        work: Math.round(Date.now() / 1000 + 1800)
    });
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('work')
    .setDescription('Get money from working!');
export const category: Category = 'economy';
