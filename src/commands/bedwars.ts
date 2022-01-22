import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { HypixelType } from 'types/hypixel';
import axios from 'axios';
import { Category } from 'types/applicationCommand';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const player = interaction.options.getString('player');
    const uuid = await axios(
        `https://api.mojang.com/users/profiles/minecraft/${player}`
    ).catch(() => null);

    if (!uuid)
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'HYPIXEL_INVALID_PLAYER'
            ),
            ephemeral: true
        });

    const { data }: { data: HypixelType } = await axios(
        `https://api.hypixel.net/player?uuid=${uuid.data.id}&key=${client.config.hypixel}`
    ).catch(() => ({ data: null }));

    const bedStats = data?.player?.stats?.Bedwars;
    if (!bedStats) {
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'HYPIXEL_PLAYER_NOT_FOUND'
            ),
            ephemeral: true
        });
    }

    const kd = Number(
        (bedStats.kills_bedwars / bedStats.deaths_bedwars).toFixed(2)
    );

    const winratio = Number(
        (bedStats.wins_bedwars / bedStats.losses_bedwars).toFixed(2)
    );

    const bedEmbed = new Embed(client, interaction.locale)
        .setLocaleTitle('HYPIXEL_STATISTICS_TITLE', { player })
        .setDescription(`K/D: ${kd}\n Win/loss ratio: ${winratio}`)
        .addLocaleField({
            name: 'HYPIXEL_WON_GAMES',
            value: `${bedStats.wins_bedwars || 0}`,
            inline: true
        })
        .addLocaleField({
            name: 'HYPIXEL_LOST_GAMES',
            value: `${bedStats.losses_bedwars || 0}`,
            inline: true
        })
        .addField('\u200B', '\u200B', true)
        .addLocaleField({
            name: 'HYPIXEL_KILLS',
            value: `${bedStats.kills_bedwars || 0}`,
            inline: true
        })
        .addLocaleField({
            name: 'HYPIXEL_DEATHS',
            value: `${bedStats.deaths_bedwars || 0}`,
            inline: true
        })
        .addField('\u200B', '\u200B', true)
        .addLocaleField({
            name: 'HYPIXEL_BEDS_DESTROYED',
            value: `${bedStats.beds_broken_bedwars || 0}`,
            inline: true
        })
        .addLocaleField({
            name: 'HYPIXEL_BEDS_LOST',
            value: `${bedStats.beds_lost_bedwars || 0}`,
            inline: true
        })
        .setThumbnail(
            `https://crafatar.com/avatars/${uuid.data.id}?default=MHF_Steve&overlay`
        );
    interaction.reply({ embeds: [bedEmbed] });
}

export const data = new SlashCommandBuilder()
    .setName('bedwars')
    .setDescription("Check a player's bedwars stats from Hypixel")
    .addStringOption(option =>
        option
            .setName('player')
            .setDescription('The player to search')
            .setRequired(true)
    );

export const category: Category = 'fun';
