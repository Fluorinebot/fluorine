import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import { Config } from 'types/databaseTables';

export async function run(client: FluorineClient, oldMessage: Message, newMessage: Message) {
    if (!newMessage || newMessage.content === oldMessage.content) {
        return;
    }

    const [settings] = (
        await client.db.query<Config>('SELECT logs_enabled, logs_channel FROM config WHERE guild_id = $1', [
            BigInt(oldMessage.guildId)
        ])
    ).rows;

    if (!settings.logs_enabled || !settings.logs_channel) {
        return;
    }

    const channel = client.channels.cache.get(settings.logs_channel.toString());
    if (!channel?.isText()) {
        return;
    }

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

    channel.send({ embeds: [embed] });
}
