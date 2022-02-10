import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';

export async function run(client: FluorineClient, message: Message, args: string[]) {
    if (!args[0]) {
        return message.reply(client.i18n.t('AI_ARGS', { lng: message.guild.preferredLocale }));
    }
    message.reply(
        client.i18n.t('AI_WAIT', {
            lng: message.guild.preferredLocale,
            queue: client.ai.queue.length + 1
        })
    );
    const argsbase = Buffer.from(args.join(' '), 'utf8').toString('base64').replaceAll('/', '_').replaceAll('+', '-');
    client.ai.getAI(message, argsbase);
}
