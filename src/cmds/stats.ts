import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';

export async function run(client: FluorineClient, message: Message) {
    const embed = new Embed(client, message.guild.preferredLocale)
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
            value: `<t:${client.uptime}:R>`
        });
    message.reply({ embeds: [embed] });
}
export const help = {
    name: 'stats',
    description: 'Statystyki bota',
    aliases: ['statystyki', 'statistics'],
    category: 'tools'
};
