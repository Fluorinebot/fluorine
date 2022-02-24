import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
export async function run(client: FluorineClient, message: Message, args: string[]) {
    if (!args[0]) {
        return message.reply(client.i18n.t('8BALL_ERROR', { lng: message.guild.preferredLocale }));
    }

    const randNumber = Math.floor(Math.random() * 6);

    const embed = new Embed(client, message.guild.preferredLocale).setDescription(args.join(' ')).addLocaleField({
        name: '8BALL_RESPONSE',
        localeValue: `8BALL_RESPONSES.${randNumber}`
    });

    message.reply({ embeds: [embed] });
}
