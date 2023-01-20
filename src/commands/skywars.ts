import { SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import { env } from '#env';
import type { Category, HypixelType, UUIDResponse } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

import type { fetch as _fetch } from 'undici';
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
    const data = (await fetch(`https://api.hypixel.net/player?uuid=${uuid.id}&key=${env.HYPIXEL_TOKEN}`)
        .then(res => res.json())
        .catch(() => ({ data: null }))) as HypixelType;

    const skyStats = data.player?.stats?.SkyWars;
    if (!skyStats) {
        return interaction.reply({
            content: client.i18n.t('HYPIXEL_PLAYER_NOT_FOUND', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const kd = Number((skyStats.kills / skyStats.deaths).toFixed(2));
    const winratio = Number((skyStats.wins / skyStats.deaths).toFixed(2));

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('HYPIXEL_STATISTICS_TITLE', { player })
        .setDescription(`K/D: ${kd}\n Win/loss ratio: ${winratio}`)
        .addFields([
            {
                name: 'HYPIXEL_WON_GAMES',
                value: `${skyStats.wins || 0}`,
                inline: true
            },
            {
                name: 'HYPIXEL_LOST_GAMES',
                value: `${skyStats.losses || 0}`,
                inline: true
            },
            { name: '\u200B', value: '\u200B', inline: true },
            {
                name: 'HYPIXEL_KILLS',
                value: `${skyStats.kills || 0}`,
                inline: true
            },
            {
                name: 'HYPIXEL_DEATHS',
                value: `${skyStats.deaths || 0}`,
                inline: true
            },
            { name: '\u200B', value: '\u200B', inline: true },
            {
                name: 'HYPIXEL_ASSISTS',
                value: `${skyStats.assists || 0}`,
                inline: true
            }
        ])
        .setThumbnail(`https://crafatar.com/avatars/${uuid.id}?default=MHF_Steve&overlay`);

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('SKYWARS').addStringOption('PLAYER', option =>
    option.setRequired(true)
);

export const category: Category = 'fun';
