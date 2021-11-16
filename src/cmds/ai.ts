import AlcanClient from '@classes/Client';
import { Message } from 'discord.js';
export async function run(
    client: AlcanClient,
    message: Message,
    args: string[]
) {
    if (message.author.id === '817883855310684180') {
        return message.reply('nie zaslugujesz na ai <:trolley:906531588278480896>');
    }

    const text = args.join(' ');
    if (!args[0]) return message.reply('Musisz podać tekst!');
    if (client.ai.filter(value => {
        value.user === message.author.id;
    }).length >= 2) {
        return message.reply('Możesz mieć max 2 wiadomości w kolejce, poczekaj chwilę!');
    }
    client.ai.add(
        client, message.author.id, message.id, encodeURIComponent(text), message.channel.id
    );
    const queue = client.ai.length || 1;
    message.reply(
        `Jesteś ${queue} w kolejce. Poczekaj na wygenerowanie wiadomości.`
    );
    if (!client.ai.isGenerating) client.ai.generate(client, client.ai[0]);
}
export const help = {
    name: 'ai',
    description: 'Wygeneruj wiadomość za pomocą sztucznej inteligencji!',
    aliases: ['si'],
    category: 'tools'
};
