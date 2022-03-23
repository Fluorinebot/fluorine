import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import createCase from '@util/createCase';
import r from 'rethinkdb';
import { Message } from 'discord.js';
import modLog from '@util/modLog';

export async function run(client: FluorineClient, message: Message, args: string[]) {
    if (!args[0]) {
        return message.reply(
            client.i18n.t('KICK_ARGUMENTS_MISSING', {
                lng: message.guild.preferredLocale
            })
        );
    }
    if (!message.member?.permissions.has('KICK_MEMBERS')) {
        return message.reply(
            client.i18n.t('KICK_PERMISSIONS_MISSING', {
                lng: message.guild.preferredLocale
            })
        );
    }
    const member = message.mentions.members?.first() ?? (await message.guild?.members.fetch(args[0]).catch(() => null));
    const reason = args.slice(1).join(' ') || client.i18n.t('NONE', { lng: message.guild.preferredLocale });

    if (!member) {
        return message.reply(
            client.i18n.t('KICK_MEMBER_MISSING', {
                lng: message.guild.preferredLocale
            })
        );
    }
    if (!member?.kickable) {
        return message.reply(
            client.i18n.t('KICK_BOT_PERMISSIONS_MISSING', {
                lng: message.guild.preferredLocale
            })
        );
    }

    if (reason.length > 1024) {
        message.reply(
            client.i18n.t('REASON_LONGER_THAN_1024', {
                lng: message.guild.preferredLocale
            })
        );
    }

    member.kick(
        client.i18n.t('KICK_REASON', {
            lng: message.guild.preferredLocale,
            user: message.author.tag,
            reason
        })
    );

    const create = await createCase(client, message?.guild, member.user, message.author, 'kick', reason);
    r.table('case').insert(create).run(client.conn);
    modLog(client, create, message.guild);
    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('KICK_SUCCESS_TITLE')
        .setLocaleDescription('KICK_SUCCESS_DESCRIPTION')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'KICK_MODERATOR', value: message.author.tag })
        .addLocaleField({ name: 'KICK_USER', value: member.user.tag })
        .addLocaleField({ name: 'REASON', value: reason })
        .addLocaleField({ name: 'PUNISHMENT_ID', value: create.id.toString() });
    message.reply({ embeds: [embed] });
    r.table('case').insert(create).run(client.conn);
}
