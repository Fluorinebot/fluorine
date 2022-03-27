import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import { Config } from 'types/databaseTables';

export async function run(client: FluorineClient, message: Message) {
    if (!message.content) {
        return;
    }

    const [settings] = (
        await client.db.query<Config>('SELECT logs_enabled, logs_channel FROM config WHERE guild_id = $1', [
            BigInt(message.guildId)
        ])
    ).rows;

    if (!settings.logs_enabled || !settings.logs_channel) {
        return;
    }

    const channel = client.channels.cache.get(settings.logs_channel.toString());
    if (!channel.isText()) {
        return;
    }

    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('MESSAGE_DELETE_TITLE')
        .setThumbnail(message.member.displayAvatarURL({ dynamic: true }))
        .addLocaleField({
            name: 'MESSAGE_DELETE_AUTHOR',
            value: message.author.tag
        })
        .addLocaleField({
            name: 'MESSAGE_DELETE_CONTENT',
            value: message.content
        });

    channel.send({ embeds: [embed] });
}
