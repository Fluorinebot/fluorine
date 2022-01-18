import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SlashCommandBuilder } from '@discordjs/builders';
import('dayjs/locale/pl');

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    dayjs.extend(duration);
    dayjs.extend(relativeTime);
    dayjs.locale(interaction.locale);
    const uptime = dayjs.duration(client.uptime).humanize();
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('STATS_TITLE')
        .addLocaleField({
            name: 'STATS_MEMORY_USAGE',
            value: `${(process.memoryUsage.rss() / 1_000_000).toFixed(1)} MB`
        })
        .addLocaleField({
            name: 'STATS_USER_COUNT',
            value: client.users.cache.size.toString()
        })
        .addLocaleField({
            name: 'STATS_SERVER_COUNT',
            value: client.guilds.cache.size.toString()
        })
        .addLocaleField({
            name: 'STATS_UPTIME',
            value: uptime
        });
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Statistics of the bot');

export const category = 'tools';
