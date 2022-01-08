import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';

export async function messageBot(client: FluorineClient, message: Message) {
    let bot = 0;
    const authorDate = new Date(message.author.createdTimestamp + 12096e5);
    const memberDate = new Date(message.member.joinedTimestamp + 1800000);
    const url = message.content.match(/\bhttps?:\/\/\S+/giu);
    const currentDate = new Date();

    const urls = url?.map(link => {
        bot += 5;
        link = link.replaceAll('www.', '');
        return { url: link };
    });
    const urlResponse = await client.phishing.getLink(urls);

    if (Object.keys(urlResponse).length !== 0) {
        bot += 25;
    }
    if (client.phishingUsers.includes(message.author.id)) {
        bot += 15;
    }
    if (authorDate > currentDate) {
        bot += 10;
    }
    if (memberDate > currentDate) {
        bot += 15;
    }
    if (message.author.flags.toArray().length === 0) {
        bot += 10;
    }
    if (!message.author.avatar) {
        bot += 5;
    }
    client.words
        .filter(word => message.content.includes(word))
        .forEach(() => (bot += 5));
    return bot;
}
