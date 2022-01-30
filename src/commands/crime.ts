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
        interaction.guild.id
    );
    if (cooldown.crime > Date.now() / 1000) {
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'CRIME_COOLDOWN_DESCRIPTION',
                { time: `<t:${cooldown.crime}:R>` }
            ),
            ephemeral: true
        });
    }
    client.economy.setCooldown(interaction.user.id, interaction.guild.id, {
        crime: Math.round(Date.now() / 1000) + 60 * 60
    });
    const random = Math.floor(Math.random() * 10);
    if (random > 7) {
        const money = Math.floor(Math.random() * -200) - 100;
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'CRIME_FAIL_DESCRIPTION',
                {
                    amount:
                        money +
                        (await client.economy.getCurrency(interaction.guild.id))
                }
            ),
            ephemeral: true
        });
    }
    const money = Math.floor(Math.random() * 200) + 100;
    const descriptions = client.language.get(
        interaction.locale,
        'CRIME_SUCCESS_DESCRIPTION'
    );

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CRIME_SUCCESS')
        .setDescription(
            descriptions[
                Math.floor(Math.random() * descriptions.length)
            ].replaceAll(
                '[amount]',
                money.toString() +
                    (await client.economy.getCurrency(interaction.guild.id))
            )
        );
    interaction.reply({ embeds: [embed] });
    client.economy.add(interaction.user.id, interaction.guild.id, money);
}
export const data = new SlashCommandBuilder()
    .setName('crime')
    .setDescription('Commit a crime');
export const category: Category = 'fun';
