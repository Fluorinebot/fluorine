import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import r from 'rethinkdb';
import { SettingsType } from 'types/settings';
export async function run(client: FluorineClient, oldMessage: Message, newMessage: Message) {
    if (!newMessage || newMessage.content === oldMessage.content) return;
    // @ts-ignore
    const settings: SettingsType = await r.table('config').get(newMessage.guild?.id).run(client.conn);
    if (!settings.logs || !settings.logsChannel) return;
    const channel = client.channels.cache.get(settings.logsChannel);
    if (!channel.isText()) return;
    const { member } = newMessage;
    const embed = new Embed(client, newMessage.guild.preferredLocale)
        .setLocaleTitle('MESSAGE_UPDATE_TITLE')
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addLocaleField({
            name: 'MESSAGE_UPDATE_AUTHOR',
            value: member.user.tag
        })
        .addLocaleField({
            name: 'MESSAGE_UPDATE_OLD_CONTENT',
            localeValue: 'NONE',
            value: oldMessage.content
        })
        .addLocaleField({
            name: 'MESSAGE_UPDATE_NEW_CONTENT',
            localeValue: 'NONE',
            value: newMessage.content
        });

    channel?.send({ embeds: [embed] });
}
