import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';
import { Message } from 'discord.js';
import getCase from '@util/getCase';
export async function run(
    client: FluorineClient,
    message: Message,
    args: Array<string>
) {
    if (!args[0])
        return message.reply(client.language.get('pl', 'CASE_INVALID_CASE_ID'));

    const [Case] = await getCase(client, message.guild, parseInt(args[0]));
    if (!Case)
        return message.reply(client.language.get('pl', 'CASE_NOT_FOUND'));
    const user = await client.users.fetch(Case.user);
    const creator = await client.users.fetch(Case.creator);
    const embed = new Embed()
        .setTitle(client.language.get('pl', 'CASE_TITLE', { id: args[0] }))
        .setThumbnail(user?.displayAvatarURL({ dynamic: true }))
        .addField(client.language.get('pl', 'CASE_USER'), user.tag)
        .addField(client.language.get('pl', 'CASE_MODERATOR'), creator.tag)
        // @ts-ignore
        .addField(
            client.language.get('pl', 'CASE_TYPE'),
            client.language.get('pl', Case.type.toUpperCase())
        )
        .addField(client.language.get('pl', 'CASE_REASON'), Case.dscp)
        .setFooter(client.footer);
    message.reply({ embeds: [embed] });
}
export const help = {
    name: 'case',
    description: 'Sprawdź informacje o karze.',
    aliases: ['kara'],
    category: 'mod'
};
