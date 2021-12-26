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
    if (!message.member?.permissions.has('KICK_MEMBERS')) {
        return message.reply(
            'Nie masz permisji aby zwarnować tego użytkownika'
        );
    }
    if (!args[0])
        return message.reply('Członek którego chcesz zwarnować nie istnieje!');

    const member =
        message.mentions.members?.first() ??
        (await message.guild?.members.fetch(args[0]).catch(() => null));
    const reason = args.slice(1).join(' ') || 'Brak powodu';
    if (member === message.member)
        return message.reply('Nie możesz zwarnować samego siebie!a');
    if (!member)
        return message.reply('Członek którego chcesz zwarnować nie istnieje!');
    if (reason.length > 1024) {
        message.reply('Powód nie może być dłuższy niż 1024');
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
    const embed = new Embed()
        .setTitle('Zwarnowano!')
        .setDescription('Pomyślnie zwarnowano członka!')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addField(
            'Zwarnowany przez:',
            message.author.tag || 'Nie znaleziono (prawdopodobnie błąd w bocie)'
        )
        .addField(
            'Zwarnowany:',
            member.user.tag || 'Nie znaleziono (prawdopodobnie błąd w bocie)'
        )
        .addField('Powód', reason)
        .addField('ID kary', create.id.toString())
        .setFooter(client.footer);
    message.reply({ embeds: [embed] });

    r.table('case').insert(create).run(client.conn);
}
export const help = {
    name: 'warn',
    description: 'Zwarnuj kogoś z serwera',
    aliases: ['zbanuj'],
    category: 'moderation'
};
