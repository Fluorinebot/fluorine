import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { ChannelType } from 'discord-api-types/v10';
import type { Message } from 'tiscord';

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

    const channel = await client.channels.get(logsChannel.toString());
    if (channel.type !== ChannelType.GuildText) {
        return;
    }

    const embed = new Embed(client, message.guild.locale)
        .setLocaleTitle('MESSAGE_DELETE_TITLE')
        .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`)
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

    channel.send({ embeds: [embed.toJSON()] });
}
