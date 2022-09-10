import { Embed, type FluorineClient } from '#classes';
import type { Message } from 'discord.js';

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
    if (!channel?.isTextBased()) {
        return;
    }

    const { member } = newMessage;

    const embed = new Embed(client, newMessage.guild.preferredLocale)
        .setLocaleTitle('MESSAGE_UPDATE_TITLE')
        .setThumbnail(member.displayAvatarURL())
        .addLocaleFields([
            {
                name: 'MESSAGE_UPDATE_AUTHOR',
                value: member.user.tag
            },
            {
                name: 'MESSAGE_UPDATE_OLD_CONTENT',
                localeValue: 'NONE',
                value: oldMessage.content
            },
            {
                name: 'MESSAGE_UPDATE_NEW_CONTENT',
                localeValue: 'NONE',
                value: newMessage.content
            }
        ]);

    channel.send({ embeds: [embed] });
}
