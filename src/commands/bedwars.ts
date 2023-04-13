import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import { env } from '#env';
import type { Category, HypixelType, UUIDResponse } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

import type { fetch as _fetch } from 'undici';
declare const fetch: typeof _fetch;

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const player = interaction.options.getString('player');
    const uuid = (await fetch(`https://api.mojang.com/users/profiles/minecraft/${player}`).then((res) =>
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

    const data = (await fetch(`https://api.hypixel.net/player?uuid=${uuid.id}&key=${env.HYPIXEL_TOKEN}`).then((res) =>
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

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('HYPIXEL_STATISTICS_TITLE', { player })
        .setDescription(`K/D: ${kd}\n Win/loss ratio: ${winratio}`, { raw: true })
        .addFields([
            { name: 'HYPIXEL_WON_GAMES', rawValue: `${bedStats.wins_bedwars || 0}`, inline: true },
            { name: 'HYPIXEL_LOST_GAMES', rawValue: `${bedStats.losses_bedwars || 0}`, inline: true },
            { rawName: '\u200B', rawValue: '\u200B', inline: true },
            { name: 'HYPIXEL_KILLS', rawValue: `${bedStats.kills_bedwars || 0}`, inline: true },
            { name: 'HYPIXEL_DEATHS', rawValue: `${bedStats.deaths_bedwars || 0}`, inline: true },
            { rawName: '\u200B', rawValue: '\u200B', inline: true },
            { name: 'HYPIXEL_BEDS_DESTROYED', rawValue: `${bedStats.beds_broken_bedwars || 0}`, inline: true },
            { name: 'HYPIXEL_BEDS_LOST', rawValue: `${bedStats.beds_lost_bedwars || 0}`, inline: true }
        ])
        .setThumbnail(`https://crafatar.com/avatars/${uuid.id}?default=MHF_Steve&overlay`);

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('BEDWARS').addStringOption('PLAYER', (option) =>
    option.setRequired(true)
);

export const category: Category = 'fun';
