import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import createCase from '@util/createCase';
import r from 'rethinkdb';
import { Message } from 'discord.js';
import modLog from '@util/modLog';

export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (!args[0])
        return message.reply(
            client.language.get('pl', 'KICK_ARGUMENTS_MISSING')
        );
    if (!message.member?.permissions.has('KICK_MEMBERS')) {
        return message.reply(
            client.language.get('pl', 'KICK_PERMISSIONS_MISSING')
        );
    }
    const member =
        message.mentions.members?.first() ??
        (await message.guild?.members.fetch(args[0]).catch(() => null));
    const reason =
        args.slice(1).join(' ') || client.language.get('pl', 'NO_REASON');

    if (!member)
        return message.reply(client.language.get('pl', 'KICK_MEMBER_MISSING'));
    if (!member?.kickable)
        return message.reply(
            client.language.get('pl', 'KICK_BOT_PERMISSIONS_MISSING')
        );

    if (reason.length > 1024) {
        message.reply(client.language.get('pl', 'REASON_LONGER_THAN_1024'));
    }

    member.kick(
        client.language.get('pl', 'KICK_REASON', {
            user: message.author.tag,
            reason
        })
    );

    const create = await createCase(
        client,
        message?.guild,
        member.user,
        message.author,
        'kick',
        reason
    );
    r.table('case').insert(create).run(client.conn);
    modLog(client, create, message.guild);
    const embed = new Embed()
        .setTitle(client.language.get('pl', 'KICK_SUCCESS_TITLE'))
        .setDescription(client.language.get('pl', 'KICK_SUCCESS_DESCRIPTION'))
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addField(
            client.language.get('pl', 'KICK_MODERATOR'),
            message.author.tag
        )
        .addField(client.language.get('pl', 'KICK_USER'), member.user.tag)
        .addField(client.language.get('pl', 'REASON'), reason)
        .addField(
            client.language.get('pl', 'PUNISHMENT_ID'),
            create.id.toString()
        )
        .setFooter(client.footer);
    message.reply({ embeds: [embed] });
    r.table('case').insert(create).run(client.conn);
}
export const help = {
    name: 'kick',
    description: 'Wyrzuć kogoś z serwera',
    aliases: ['wyrzuć'],
    category: 'moderation'
};
