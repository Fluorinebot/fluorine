import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';

export async function messageBot(client: FluorineClient, message: Message) {
    let bot = 0;
    const authorDate = new Date(message.author.createdTimestamp + 12096e5);
    const memberDate = new Date(message.member.joinedTimestamp + 1800000);
    const url = message.content.match(/\bhttps?:\/\/\S+/giu);
    const currentDate = new Date();
    const urls = [];
    if (client.phishingUsers.includes(message.author.id)) {
        bot += 15;
    }
    client.words.forEach(word => {
        if (message.content.includes(word)) {
            bot += 5;
        }
    });
    url?.forEach(link => {
        bot += 5;
        link = link.replaceAll('www.', '');
        urls.push({ url: link });
    });
    const urlResponse = await client.phishing.getLink(urls);
    if (urlResponse === {}) {
        bot += 25;
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
    return bot;
}
