import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (!args[0]) {
        return message.reply(
            client.language.get(message.guild.preferredLocale, 'AI_ARGS')
        );
    }
    message.reply(
        client.language.get(message.guild.preferredLocale, 'AI_WAIT', {
            queue: client.ai.queue.length + 1
        })
    );
    const argsbase = Buffer.from(args.join(' '), 'utf8')
        .toString('base64')
        .replaceAll('/', '_')
        .replaceAll('+', '-');
    client.ai.getAI(message, argsbase);
}
export const help = {
    name: 'ai',
    description: 'Make AI complete your sentence',
    aliases: [],
    category: 'fun'
};
