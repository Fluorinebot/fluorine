import { EmbedBuilder } from '#builders';
import type { FluorineClient } from '#classes';
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

    const embed = new EmbedBuilder(client, message.guild.preferredLocale)
        .setTitle('MESSAGE_DELETE_TITLE')
        .setThumbnail(message.member.displayAvatarURL())
        .addFields(
            {
                name: 'MESSAGE_DELETE_AUTHOR',
                rawValue: message.author.tag
            },
            {
                name: 'MESSAGE_DELETE_CONTENT',
                rawValue: message.content
            }
        );

    channel.send({ embeds: [embed.builder] });
}
