import getCase from '@util/getCase';
import { Message } from 'discord.js';
import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';

export async function run(client: FluorineClient, message: Message, args: Array<string>) {
    if (!args[0])
        return message.reply(
            client.i18n.t('CASE_INVALID_CASE_ID', {
                lng: message.guild.preferredLocale
            })
        );

    const [Case] = await getCase(client, message.guild, parseInt(args[0]));
    if (!Case)
        return message.reply(
            client.i18n.t('CASE_NOT_FOUND', {
                lng: message.guild.preferredLocale
            })
        );
    const user = await client.users.fetch(Case.user);
    const creator = await client.users.fetch(Case.creator);
    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('CASE_TITLE', { id: args[0] })
        .setThumbnail(user?.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'CASE_USER', value: user.tag })
        .addLocaleField({ name: 'CASE_MODERATOR', value: creator.tag })
        .addLocaleField({
            name: 'CASE_TYPE',
            localeValue: Case.type.toUpperCase()
        })
        .addLocaleField({ name: 'CASE_REASON', value: Case.dscp });
    message.reply({ embeds: [embed] });
}
