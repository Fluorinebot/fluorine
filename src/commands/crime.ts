import FluorineClient from '@classes/Client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';
import { CommandInteraction } from 'discord.js';
import Embed from '@classes/Embed';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const cooldown = await client.economy.getCooldown(
        interaction.user.id,
        interaction.guildId
    );
    if (cooldown.crime > Date.now() / 1000) {
        return interaction.reply({
            content: client.i18n.t('CRIME_COOLDOWN_DESCRIPTION', {
                lng: interaction.locale,
                time: `<t:${cooldown.crime}:R>`
            }),
            ephemeral: true
        });
    }
    client.economy.setCooldown(interaction.user.id, interaction.guild.id, {
        crime: Math.round(Date.now() / 1000) + 60 * 60
    });
    const currency = await client.economy.getCurrency(interaction.guildId);
    const random = Math.floor(Math.random() * 10);
    if (random > 7) {
        const money = Math.floor(Math.random() * 200) + 50;
        interaction.reply({
            content: client.i18n.t('CRIME_FAIL_DESCRIPTION', {
                lng: interaction.locale,
                amount: `${money} ${currency}`
            }),
            ephemeral: true
        });
        return client.economy.subtract(
            interaction.user.id,
            interaction.guildId,
            money
        );
    }
    const money = Math.floor(Math.random() * 200) + 100;

    const description = client.i18n.t(
        `CRIME_SUCCESS_DESCRIPTION.${Math.floor(Math.random() * 3)}`,
        {
            lng: interaction.locale,
            amount: `${money} ${currency}`
        }
    );

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CRIME_SUCCESS')
        .setDescription(description);
    interaction.reply({ embeds: [embed] });
    client.economy.add(interaction.user.id, interaction.guild.id, money);
}
export const data = new SlashCommandBuilder()
    .setName('crime')
    .setDescription('Commit a crime');
export const category: Category = 'fun';
