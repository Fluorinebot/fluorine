import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import { HypixelType } from 'types/hypixel';
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

    if (!uuid.id)
        return message.reply(
            client.language.get(
                message.guild.preferredLocale,
                'HYPIXEL_INVALID_PLAYER'
            )
        );

    const data = (await fetch(
        `https://api.hypixel.net/player?uuid=${uuid.data.id}&key=${client.config.hypixel}`
    ).then(res => res.json())) as HypixelType;
    const bedStats = data.player?.stats?.Bedwars;
    if (!bedStats) {
        return message.reply(
            client.language.get(
                message.guild.preferredLocale,
                'HYPIXEL_PLAYER_NOT_FOUND'
            )
        );
    }

    const kd = (bedStats.kills_bedwars / bedStats.deaths_bedwars).toFixed(2);
    const winratio = (bedStats.wins_bedwars / bedStats.losses_bedwars).toFixed(
        2
    );
    const bedEmbed = new Embed(client, message.guild.preferredLocale)
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
    message.reply({ embeds: [bedEmbed] });
}
export const help = {
    name: 'bedwars',
    description: 'Sprawdź statystyki gracza na bedwarsach z hypixel.net',
    aliases: [],
    category: 'fun'
};
