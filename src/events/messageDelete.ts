import { Embed, type FluorineClient } from '#classes';
import type { Message } from 'discord.js';

export async function run(client: FluorineClient, message: Message) {
    if (!message.content) {
        return;
    }

    const { logsEnabled, logsChannel } = await client.prisma.config.findUnique({
        where: {
            guildId: BigInt(message.guild.id)
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
    if (!channel.isTextBased()) {
        return;
    }

    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('MESSAGE_DELETE_TITLE')
        .setThumbnail(message.member.displayAvatarURL())
        .addLocaleFields([
            {
                name: 'MESSAGE_DELETE_AUTHOR',
                value: message.author.tag
            },
            {
                name: 'MESSAGE_DELETE_CONTENT',
                value: message.content
            }
        ]);

    channel.send({ embeds: [embed] });
}
