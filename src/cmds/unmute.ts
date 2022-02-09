import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import r from 'rethinkdb';

export async function run(client: FluorineClient, message: Message, args: string[]) {
    const config: any = await r.table('config').get(message.guild?.id).run(client.conn);
    if (!message.member?.permissions.has('MANAGE_ROLES'))
        return message.reply('Nie masz permisji do odmutowania tego użytkownika!');

    if (!message.guild?.me?.permissions.has('MANAGE_ROLES'))
        return message.reply('Nie posiadam permisji do zarządzania rolami!');
    if (!config.muteRole) return message.reply('Nie ustawiono roli do mute, ustaw ją komendą config!');
    if (!args[0]) return message.reply('Musisz podać użykownika');

    const member = message.mentions.members?.first() ?? (await message.guild?.members.fetch(args[0]).catch(() => null));
    const reason = args.slice(1).join(' ') || 'Brak powodu';

    if (!member) return message.reply('Członek którego chcesz odmutować nie istnieje!');
    if (reason.length > 1024) {
        message.reply('Powód nie może być dłuższy niż 1024');
    }

    member.roles.remove(config.muteRole, `${reason} | ${message.author.tag}`);
    const embed = new Embed(client, message.guild.preferredLocale)
        .setTitle('Odmutowano!')
        .setDescription('Pomyślnie odmutowano członka!')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addField('Odmutowany przez:', message.author.tag)
        .addField('Odmutowany:', member.user.tag)
        .addField('Powód', reason || 'Brak');
    message.reply({ embeds: [embed] });
}
