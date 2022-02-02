import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { HypixelType } from 'types/hypixel';
import { Message } from 'discord.js';
import { fetch } from 'undici';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (!args[0])
        return message.reply(
            client.language.get(
                message.guild.preferredLocale,
                'HYPIXEL_NO_ARGS',
                { command: 'bedwars' }
            )
        );
    const uuid: any = await fetch(
        `https://api.mojang.com/users/profiles/minecraft/${args[0]}`
    ).then(res => res.json());

    if (!uuid.data.id)
        return message.reply(
            client.language.get(
                message.guild.preferredLocale,
                'HYPIXEL_INVALID_PLAYER'
            )
        );
    const data = (await fetch(
        `https://api.hypixel.net/player?uuid=${uuid.data.id}&key=${process.env.HYPIXEL_TOKEN}`
    ).then(res => res.json())) as HypixelType;

    const skyStats = data.player?.stats?.SkyWars;
    if (!skyStats) {
        return message.reply(
            client.language.get(
                message.guild.preferredLocale,
                'HYPIXEL_PLAYER_NOT_FOUND'
            )
        );
    }
    const kd = (skyStats.kills / skyStats.deaths).toFixed(2);
    const winratio = (skyStats.wins / skyStats.deaths).toFixed(2);
    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('HYPIXEL_STATISTICS_TITLE', {
            player: args[0]
        })
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
    message.reply({ embeds: [embed] });
}
export const help = {
    name: 'skywars',
    description: 'Sprawdź statystyki gracza na skywarsach z hypixel.net',
    aliases: [],
    category: 'fun'
};
