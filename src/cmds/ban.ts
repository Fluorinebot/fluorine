import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';
import { Message } from 'discord.js';
import createCase from '../util/createCase';
import r from 'rethinkdb';
import modLog from '@util/modLog';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (!message.member?.permissions.has('BAN_MEMBERS')) {
        return message.reply(
            client.language.get('pl', 'BAN_PERMISSIONS_MISSING')
        );
    }

    if (!args[0])
        return message.reply(
            client.language.get('pl', 'BAN_ARGUMENTS_MISSING')
        );

    const member =
        message.mentions.members?.first() ??
        (await message.guild?.members.fetch(args[0]).catch(() => null));
    const reason =
        args.slice(1).join(' ') || client.language.get('pl', 'NO_REASON');

    if (!member)
        return message.reply(client.language.get('pl', 'BAN_MEMBER_MISSING'));

    if (!member?.bannable)
        return message.reply(
            client.language.get('pl', 'BAN_BOT_PERMISSIONS_MISSING')
        );

    if (reason.length > 1024) {
        message.reply(client.language.get('pl', 'REASON_LONGER_THAN_1024'));
    }

    const create = await createCase(
        client,
        message?.guild,
        member.user,
        message.author,
        'ban',
        reason
    );

    member.ban({
        reason: client.language.get('pl', 'BAN_REASON', {
            user: message.author.tag,
            reason
        })
    });

    modLog(client, create, message.guild);
    const embed = new Embed()
        .setTitle(client.language.get('pl', 'BAN_SUCCESS_TITLE'))
        .setDescription(client.language.get('pl', 'BAN_SUCCESS_DESCRIPTION'))
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addField(
            client.language.get('pl', 'BAN_MODERATOR'),
            message.author.tag
        )
        .addField(client.language.get('pl', 'BAN_USER'), member.user.tag)
        .addField(
            client.language.get('pl', 'REASON'),
            reason || client.language.get('pl', 'NO_REASON')
        )
        .addField(
            client.language.get('pl', 'PUNISHMENT_ID'),
            create.id.toString()
        )
        .setFooter(client.footer);
    message.reply({ embeds: [embed] });

    r.table('case').insert(create).run(client.conn);
}
export const help = {
    name: 'ban',
    description: 'Zbanuj kogoś z serwera',
    aliases: ['zbanuj'],
    category: 'moderation'
};
