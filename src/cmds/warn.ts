import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import createCase from '@util/createCase';
import modLog from '@util/modLog';
import { Message } from 'discord.js';
import r from 'rethinkdb';

export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (!message.member?.permissions.has('MODERATE_MEMBERS')) {
        return message.reply(
            client.i18n.t('WARN_PERMISSIONS_MISSING', {
                lng: message.guild.preferredLocale
            })
        );
    }
    if (!args[0])
        return message.reply(
            client.i18n.t('WARN_ARGUMENTS_MISSING', {
                lng: message.guild.preferredLocale
            })
        );

    const member =
        message.mentions.members?.first() ??
        (await message.guild?.members.fetch(args[0]).catch(() => null));
    const reason =
        args.slice(1).join(' ') ||
        client.i18n.t('NONE', {
            lng: message.guild.preferredLocale
        });
    if (member === message.member)
        return message.reply(
            client.i18n.t('WARN_ERROR_YOURSELF', {
                lng: message.guild.preferredLocale
            })
        );
    if (!member)
        return message.reply(
            client.i18n.t('WARN_MEMBER_MISSING', {
                lng: message.guild.preferredLocale
            })
        );
    if (reason.length > 1024) {
        message.reply(
            client.i18n.t('REASON_LONGER_THAN_1024', {
                lng: message.guild.preferredLocale
            })
        );
    }

    const create = await createCase(
        client,
        message?.guild,
        member.user,
        message.author,
        'warn',
        reason
    );
    r.table('case').insert(create).run(client.conn);
    modLog(client, create, message.guild);
    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('WARN_SUCCESS_TITLE')
        .setLocaleDescription('WARN_SUCCESS_DESCRIPTION')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'WARN_MODERATOR', value: message.author.tag })
        .addLocaleField({ name: 'WARN_USER', value: member.user.tag })
        .addLocaleField({ name: 'REASON', value: reason })
        .addLocaleField({ name: 'PUNISHMENT_ID', value: create.id.toString() });
    message.reply({ embeds: [embed] });

    r.table('case').insert(create).run(client.conn);
}
export const help = {
    name: 'warn',
    description: 'Zwarnuj kogoś z serwera',
    aliases: ['zbanuj'],
    category: 'moderation'
};
