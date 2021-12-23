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
    const embed = new Embed('pl')
        .setLocaleTitle('CASE_TITLE', { id: args[0] })
        .setThumbnail(user?.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'CASE_USER', value: user.tag })
        .addLocaleField({ name: 'CASE_MODERATOR', value: creator.tag })
        .addLocaleField({
            name: 'CASE_TYPE',
            localeValue: Case.type.toUpperCase()
        })
        .addLocaleField({ name: 'CASE_REASON', value: Case.dscp })
        .setFooter(client.footer);
    message.reply({ embeds: [embed] });
}
export const help = {
    name: 'case',
    description: 'Sprawdź informacje o karze.',
    aliases: ['kara'],
    category: 'mod'
};
