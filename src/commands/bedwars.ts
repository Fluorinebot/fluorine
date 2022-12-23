import { Embed, type FluorineClient } from '#classes';
import type { Category, HypixelType, UUIDResponse } from '#types';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import type { fetch as _fetch } from 'undici';
import { env } from '#env';
declare const fetch: typeof _fetch;

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const player = interaction.options.getString('player');
    const uuid = (await fetch(`https://api.mojang.com/users/profiles/minecraft/${player}`).then(res =>
        res.json()
    )) as UUIDResponse;

    if (!uuid) {
        return interaction.reply({
            content: client.i18n.t('HYPIXEL_INVALID_PLAYER', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const data = (await fetch(`https://api.hypixel.net/player?uuid=${uuid.id}&key=${env.HYPIXEL_TOKEN}`).then(res =>
        res.json()
    )) as HypixelType;
    const bedStats = data?.player?.stats?.Bedwars;

    if (!bedStats) {
        return interaction.reply({
            content: client.i18n.t('HYPIXEL_PLAYER_NOT_FOUND', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const kd = Number((bedStats.kills_bedwars / bedStats.deaths_bedwars).toFixed(2));

    const winratio = Number((bedStats.wins_bedwars / bedStats.losses_bedwars).toFixed(2));

    const bedEmbed = new Embed(client, interaction.locale)
        .setLocaleTitle('HYPIXEL_STATISTICS_TITLE', { player })
        .setDescription(`K/D: ${kd}\n Win/loss ratio: ${winratio}`)
        .addLocaleFields([
            {
                name: 'HYPIXEL_WON_GAMES',
                value: `${bedStats.wins_bedwars || 0}`,
                inline: true
            },
            {
                name: 'HYPIXEL_LOST_GAMES',
                value: `${bedStats.losses_bedwars || 0}`,
                inline: true
            },
            { name: '\u200B', value: '\u200B', inline: true },
            {
                name: 'HYPIXEL_KILLS',
                value: `${bedStats.kills_bedwars || 0}`,
                inline: true
            },
            {
                name: 'HYPIXEL_DEATHS',
                value: `${bedStats.deaths_bedwars || 0}`,
                inline: true
            },
            { name: '\u200B', value: '\u200B', inline: true },
            {
                name: 'HYPIXEL_BEDS_DESTROYED',
                value: `${bedStats.beds_broken_bedwars || 0}`,
                inline: true
            },
            {
                name: 'HYPIXEL_BEDS_LOST',
                value: `${bedStats.beds_lost_bedwars || 0}`,
                inline: true
            }
        ])
        .setThumbnail(`https://crafatar.com/avatars/${uuid.id}?default=MHF_Steve&overlay`);

    interaction.reply({ embeds: [bedEmbed] });
}

export const slashCommandData = new SlashCommandBuilder()
    .setName('bedwars')
    .setNameLocalizations({ pl: 'bedwars' })
    .setDescription("Check a player's bedwars stats from Hypixel")
    .setDescriptionLocalizations({ pl: 'Sprawdź statystyki gracza Hypixela' })
    .addStringOption(option =>
        option
            .setName('player')
            .setNameLocalizations({ pl: 'gracz' })
            .setDescription('The player to search')
            .setDescriptionLocalizations({ pl: 'Gracz, którego statystyki sprawdzasz' })
            .setRequired(true)
    );

export const category: Category = 'fun';
