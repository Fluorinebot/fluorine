import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { ChatInputCommandInteraction } from 'discord.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import('dayjs/locale/pl');

export async function run(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction
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
export const help = {
    name: 'stats',
    description: 'Statystyki bota',
    aliases: ['statystyki', 'statistics'],
    category: 'tools'
};
