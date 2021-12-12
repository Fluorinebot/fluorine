import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { HypixelType } from 'types/hypixel.type';
import axios from 'axios';
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
            content: 'Podano nieprawidłowego użytkownika!',
            ephemeral: true
        });

    const { data }: { data: HypixelType } = await axios(
        `https://api.hypixel.net/player?uuid=${uuid.data.id}&key=${client.config.hypixel}`
    );

    const bedStats = data.player?.stats?.Bedwars;
    if (!bedStats) {
        return interaction.reply({
            content: 'Nie istnieje taki gracz!',
            ephemeral: true
        });
    }

    const kd = (bedStats.kills_bedwars / bedStats.deaths_bedwars).toFixed(2);
    const winratio = (bedStats.wins_bedwars / bedStats.losses_bedwars).toFixed(
        2
    );
    const bedEmbed = new Embed()
        .setDescription(`K/D: ${kd}\n Win/loss ratio: ${winratio}`)
        .setTitle(`Statystyki gracza ${player}`)
        .addField('Wygrane gry', `${bedStats.wins_bedwars || 0}`, true)
        .addField('Przegrane gry', `${bedStats.losses_bedwars || 0}`, true)
        .addField('\u200B', '\u200B', true)
        .addField('Zabójstwa', `${bedStats.kills_bedwars || 0} `, true)
        .addField('Śmierci', `${bedStats.deaths_bedwars || 0}`, true)
        .addField('\u200B', '\u200B', true)
        .addField(
            'Zniszczone łóżka',
            `${bedStats.beds_broken_bedwars || 0}`,
            true
        )
        .addField('Stracone łóżka', `${bedStats.beds_lost_bedwars || 0}`, true)
        .setThumbnail(
            `https://crafatar.com/avatars/${uuid.data.id}?default=MHF_Steve&overlay`
        )
        .setFooter(client.footer);
    interaction.reply({ embeds: [bedEmbed] });
}
export const help = {
    name: 'bedwars',
    description: 'Sprawdź statystyki gracza na bedwarsach z hypixel.net',
    aliases: [],
    category: 'fun'
};
