import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import createCase from '@util/createCase';
import r from 'rethinkdb';
import modLog from '@util/modLog';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    const config: any = await r
        .table('config')
        .get(message.guild?.id)
        .run(client.conn);
    if (!message.member?.permissions.has('MANAGE_ROLES'))
        return message.reply(
            'Nie masz permisji do zmutowania tego użytkownika!'
        );

    if (!message.guild?.me?.permissions.has('MANAGE_ROLES'))
        return message.reply('Nie posiadam permisji do zarządzania rolami!');
    if (!config.muteRole)
        return message.reply(
            'Nie ustawiono roli do mute, ustaw ją komendą config!'
        );
    if (!args[0]) return message.reply('Musisz podać użykownika');

    const member =
        message.mentions.members?.first() ??
        (await message.guild?.members.fetch(args[0]).catch(() => null));
    const reason = args.slice(1).join(' ') || 'Brak powodu';

    if (!member)
        return message.reply('Członek którego chcesz zmutować nie istnieje!');
    if (reason.length > 1024) {
        message.reply('Powód nie może być dłuższy niż 1024');
    }

    const create = await createCase(
        client,
        message?.guild,
        member.user,
        message.author,
        'mute',
        reason
    );
    member.roles.add(config.muteRole, `${reason} | ${message.author.tag}`);
    modLog(client, create, message.guild);
    const embed = new Embed()
        .setTitle('Zmutowano!')
        .setDescription('Pomyślnie zmutowano członka!')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addField('Zmutowany przez:', message.author.tag)
        .addField('Zmutowany:', member.user.tag)
        .addField('Powód', reason || 'Brak')
        .addField('ID kary', create.id.toString())
        .setFooter(client.footer);
    message.reply({ embeds: [embed] });

    r.table('case').insert(create).run(client.conn);
}
export const help = {
    name: 'mute',
    description: 'Zmutuj kogoś z serwera',
    aliases: ['zmutuj', 'cisza'],
    category: 'moderation'
};
