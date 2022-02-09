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
            value: `<t:${Math.floor((Date.now() - client.uptime) / 1000)}:R>`
        });
    message.reply({ embeds: [embed] });
}
