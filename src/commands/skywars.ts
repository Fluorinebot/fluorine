import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { HypixelType } from 'types/hypixel';
import { fetch } from 'undici';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const player = interaction.options.getString('player');
    const uuid: any = await fetch(
        `https://api.mojang.com/users/profiles/minecraft/${player}`
    )
        .then(res => res.json())
        .catch(() => null);

    if (!uuid)
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'HYPIXEL_INVALID_PLAYER'
            ),
            ephemeral: true
        });
    const data = (await fetch(
        `https://api.hypixel.net/player?uuid=${uuid.data.id}&key=${process.env.HYPIXEL_TOKEN}`
    )
        .then(res => res.json())
        .catch(() => ({ data: null }))) as HypixelType;

    const skyStats = data.player?.stats?.SkyWars;
    if (!skyStats) {
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'HYPIXEL_PLAYER_NOT_FOUND'
            ),
            ephemeral: true
        });
    }

    const kd = Number((skyStats.kills / skyStats.deaths).toFixed(2));

    const winratio = Number((skyStats.wins / skyStats.deaths).toFixed(2));

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('HYPIXEL_STATISTICS_TITLE', { player })
        .setDescription(`K/D: ${kd}\n Win/loss ratio: ${winratio}`)
        .addLocaleField({
            name: 'HYPIXEL_WON_GAMES',
            value: `${skyStats.wins || 0}`,
            inline: true
        })
        .addLocaleField({
            name: 'HYPIXEL_LOST_GAMES',
            value: `${skyStats.losses || 0}`,
            inline: true
        })
        .addField('\u200B', '\u200B', true)
        .addLocaleField({
            name: 'HYPIXEL_KILLS',
            value: `${skyStats.kills || 0}`,
            inline: true
        })
        .addLocaleField({
            name: 'HYPIXEL_DEATHS',
            value: `${skyStats.deaths || 0}`,
            inline: true
        })
        .addField('\u200B', '\u200B', true)
        .addLocaleField({
            name: 'HYPIXEL_ASSISTS',
            value: `${skyStats.assists || 0}`,
            inline: true
        })
        .setThumbnail(
            `https://crafatar.com/avatars/${uuid.data.id}?default=MHF_Steve&overlay`
        );
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('skywars')
    .setDescription("Check a player's skywars stats from Hypixel")
    .addStringOption(option =>
        option
            .setName('player')
            .setDescription('The player to search')
            .setRequired(true)
    );

export const category: Category = 'fun';
