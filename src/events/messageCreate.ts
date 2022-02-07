import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';
export async function run(client: FluorineClient, message: Message) {
    if (message.author.bot) return;

    if (message.channel.type === 'DM') {
        return message.reply(
            client.i18n.t('MESSAGE_CREATE_DM', {
                lng: message.guild.preferredLocale
            })
        );
    }
}
