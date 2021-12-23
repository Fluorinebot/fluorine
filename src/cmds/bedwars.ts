import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import { HypixelType } from 'types/hypixel.type';
import axios from 'axios';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (!args[0])
        return message.reply(
            client.language.get('pl', 'HYPIXEL_NO_ARGS', { command: 'bedwars' })
        );

    const uuid: any = await axios(
        `https://api.mojang.com/users/profiles/minecraft/${args[0]}`
    );
    if (!uuid.data.id)
        return message.reply(
            client.language.get('pl', 'HYPIXEL_INVALID_PLAYER')
        );
    // @ts-ignore
    const { data }: HypixelType = await axios(
        `https://api.hypixel.net/player?uuid=${uuid.data.id}&key=${client.config.hypixel}`
    );
    const bedStats = data.player?.stats?.Bedwars;
    if (!bedStats) {
        return message.reply(
            client.language.get('pl', 'HYPIXEL_PLAYER_NOT_FOUND')
        );
    }

    const kd = (bedStats.kills_bedwars / bedStats.deaths_bedwars).toFixed(2);
    const winratio = (bedStats.wins_bedwars / bedStats.losses_bedwars).toFixed(
        2
    );
    const bedEmbed = new Embed('pl')
        .setLocaleTitle('HYPIXEL_STATISTICS_TITLE', {
            player: args[0]
        })
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
            value: `${bedStats.kills_bedwars || 0} `,
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
        )
        .setFooter(client.footer);
    message.reply({ embeds: [bedEmbed] });
}
export const help = {
    name: 'bedwars',
    description: 'Sprawdź statystyki gracza na bedwarsach z hypixel.net',
    aliases: [],
    category: 'fun'
};
