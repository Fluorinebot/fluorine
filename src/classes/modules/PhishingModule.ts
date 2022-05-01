import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';
import { readFileSync } from 'fs';
import { PhishingLink } from 'types/structures';

export default class PhishingModule {
    private _words: string;
    private _users: string;
    private _urls: string;

    constructor(private client: FluorineClient) {
        this._words = readFileSync(`${__dirname}/../../../assets/words.txt`).toString();
        this._users = readFileSync(`${__dirname}/../../../assets/users.txt`).toString();
        this._urls = readFileSync(`${__dirname}/../../../assets/url.txt`).toString();
    }

    async getLink(links: PhishingLink[]) {
        const request = await fetch(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.SAFEBROWSING_TOKEN}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    client: {
                        clientId: 'fluorine',
                        clientVersion: '2.0.0'
                    },
                    threatInfo: {
                        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'POTENTIALLY_HARMFUL_APPLICATION'],
                        platformTypes: ['ANY_PLATFORM'],
                        threatEntryTypes: ['URL', 'IP_RANGE'],
                        threatEntries: links
                    }
                })
            }
        );
        return request.json();
    }

    get words() {
        return this._words.split('\n');
    }

    get users() {
        return this._users.split('\n');
    }

    get urls() {
        return this._urls.split('\n');
    }

    async messageAuthorIsBot(client: FluorineClient, message: Message) {
        let likelessnessRate = 0;

        const authorDate = new Date(message.author.createdTimestamp + 12096e5);
        const memberDate = new Date(message.member.joinedTimestamp + 1800000);
        const currentDate = new Date();

        const url = message.content.match(/\bhttps?:\/\/\S+/giu);

        const urls = url?.map(link => {
            likelessnessRate += 5;
            link = link.replaceAll('www.', '');
            return { url: link };
        });

        const urlResponse = await client.phishing.getLink(urls);

        if (Object.keys(urlResponse).length !== 0) {
            likelessnessRate += 25;
        }

        if (this.users.includes(message.author.id)) {
            likelessnessRate += 15;
        }

        if (authorDate > currentDate) {
            likelessnessRate += 10;
        }

        if (memberDate > currentDate) {
            likelessnessRate += 15;
        }

        if (message.author.flags.toArray().length === 0) {
            likelessnessRate += 10;
        }

        if (!message.author.avatar) {
            likelessnessRate += 5;
        }

        this.words.filter(word => message.content.includes(word)).forEach(() => (likelessnessRate += 5));
        return likelessnessRate;
    }
}
