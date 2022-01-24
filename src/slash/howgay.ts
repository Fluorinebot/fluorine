import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (!args[0])
        return message.reply(
            client.language.get(message.guild.preferredLocale, 'HOWGAY_ARGS')
        );
    const number = Math.floor(Math.random() * 100);
    message.reply(
        client.language.get(message.guild.preferredLocale, 'HOWGAY', {
            percent: number,
            thing: message.mentions.members.first() || args.join(' ')
        })
    );
}
export const help = {
    name: 'howgay',
    description: 'How gay',
    category: 'fun'
};
