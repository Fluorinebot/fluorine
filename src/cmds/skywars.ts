import AlcanClient from '@classes/Client';
import Embed from '@classes/Embed';
import { HypixelType } from 'types/hypixel.type';
import { Message } from 'discord.js';
import axios from 'axios';
export async function run(
    client: AlcanClient,
    message: Message,
    args: string[]
) {
    if (!args[0]) return message.reply(
        'Musisz podać gracza! Prawidłowe użycie: skywars <gracz>'
    );

    const uuid: any = await axios(
        `https://api.mojang.com/users/profiles/minecraft/${args[0]}`
    );
    if (!uuid.data.id) return message.reply('Podano nieprawidłowego użytkownika!');

    const { data }: any = await axios(
        `https://api.hypixel.net/player?uuid=${uuid.data.id}&key=${client.config.hypixel}`
    );
    const body: HypixelType = data;
    const skyStats = body.player?.stats?.SkyWars;
    if (!skyStats) {
        return message.reply('Nie istnieje taki gracz!');
    }
    const kd = (skyStats.kills / skyStats.deaths).toFixed(2);
    const winratio = (skyStats.wins / skyStats.deaths).toFixed(2);
    const bedEmbed = new Embed()
        .setDescription(`K/D: ${kd}\n Win/loss ratio: ${winratio}`)
        .setTitle(`Statystyki gracza ${args[0]}`)
        .addField('Wygrane gry', `${skyStats.wins || '0'}`, true)
        .addField('Przegrane gry', `${skyStats.deaths || '0'}`, true)
        .addField('\u200B', '\u200B', true)
        .addField('Zabójstwa', `${skyStats.kills || '0'} `, true)
        .addField('Asysty', `${skyStats.assists || '0'}`, true)
        .setThumbnail(
            `https://crafatar.com/avatars/${uuid.data.id}?default=MHF_Steve&overlay`
        )
        .setFooter(client.footer);
    message.reply({ embeds: [bedEmbed] });
}
export const help = {
    name: 'skywars',
    description: 'Sprawdź statystyki gracza na skywarsach z hypixel.net',
    aliases: [],
    category: 'fun'
};
