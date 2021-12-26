import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import r from 'rethinkdb';
import { SettingsType } from 'types/settings.type';
export async function run(client: FluorineClient, message: Message) {
    if (!message.content) return;
    // @ts-ignore
    const settings: SettingsType = await r
        .table('config')
        .get(message.guild?.id)
        .run(client.conn);
    if (!settings.logs || !settings.logsChannel) return;
    const channel = client.channels.cache.get(settings.logsChannel);
    if (!channel.isText()) return;
    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('MESSAGE_DELETE_TITLE')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addLocaleField({
            name: 'MESSAGE_DELETE_AUTHOR',
            value: message.author.tag
        })
        .addLocaleField({
            name: 'MESSAGE_DELETE_CONTENT',
            value: message.content
        });
    channel?.send({ embeds: [embed] });
}
