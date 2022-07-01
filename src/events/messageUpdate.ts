import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';

export async function run(client: FluorineClient, oldMessage: Message, newMessage: Message) {
    if (!newMessage || newMessage.content === oldMessage.content) {
        return;
    }

    const { logsEnabled, logsChannel } = await client.prisma.config.findUnique({
        where: {
            guildId: BigInt(oldMessage.guild.id)
        },
        select: {
            logsEnabled: true,
            logsChannel: true
        }
    });

    if (!logsEnabled || !logsChannel) {
        return;
    }

    const channel = client.channels.cache.get(logsChannel.toString());
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
