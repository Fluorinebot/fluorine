import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';

export async function messageBot(client: FluorineClient, message: Message) {
    let bot = 0;
    const authorDate = new Date(message.author.createdTimestamp + 12096e5);
    const memberDate = new Date(message.member.joinedTimestamp + 900000);
    const url = message.content.match(/\bhttps?:\/\/\S+/giu);
    const words = message.content.split(' ');
    let urlBoolean = false;
    const currentDate = new Date();
    words.forEach(word => {
        if (client.words.includes(word)) {
            bot += 10;
        }
    });
    url?.forEach(link => {
        if (urlBoolean) return;
        bot += 5;
        link = new URL(link).hostname.replaceAll('www.', '');
        console.log(link);
        if (client.links.includes(link)) {
            console.log('Phishing detected');
            bot += 20;
            urlBoolean = true;
        }
    });
    if (authorDate > currentDate) {
        bot += 15;
    }
    if (memberDate > currentDate) {
        bot += 15;
    }
    if (message.author.flags.toArray().length === 0) {
        bot += 10;
    }
    if (!message.author.avatar) {
        bot += 10;
    }
    return bot;
}
