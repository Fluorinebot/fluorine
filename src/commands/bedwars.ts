import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { HypixelType } from 'types/hypixel';
import { Category } from 'types/structures';
import { UUIDResponse } from 'types/webRequests';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
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

    const data = (await fetch(`https://api.hypixel.net/player?uuid=${uuid.id}&key=${process.env.HYPIXEL_TOKEN}`).then(
        res => res.json()
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
        .setThumbnail(`https://crafatar.com/avatars/${uuid.id}?default=MHF_Steve&overlay`);

    interaction.reply({ embeds: [bedEmbed] });
}

export const data = new SlashCommandBuilder()
    .setName('bedwars')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription("Check a player's bedwars stats from Hypixel")
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addStringOption(option =>
        option
            .setName('player')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('The player to search')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    );

export const category: Category = 'fun';
