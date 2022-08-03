import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { ChannelType } from 'discord-api-types/v10';
import type { Message } from 'tiscord';

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

    const channel = await client.channels.get(logsChannel.toString());
    if (channel?.type === ChannelType.GuildText) {
        return;
    }

    const { member } = newMessage;

    const embed = new Embed(client, newMessage.guild.locale)
        .setLocaleTitle('MESSAGE_UPDATE_TITLE')
        .setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`)
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

    channel.send({ embeds: [embed.toJSON()] });
}
