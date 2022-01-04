import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';

export async function bot(client: FluorineClient, message: Message) {
    let bot = 0;
    const authorDate = new Date(message.author.createdTimestamp + 12096e5);
    const memberDate = new Date(message.member.joinedTimestamp + 3600000);
    const currentDate = new Date();
    if (authorDate > currentDate) {
        bot += 15;
    }
    if (memberDate > currentDate) {
        bot += 15;
    }
    if (message.author.flags.toArray().length === 0) {
        bot += 10;
    }
    return bot;
}
