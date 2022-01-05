import FluorineClient from '@classes/Client';
import { readFileSync } from 'fs';
import { fetch } from 'undici';
export default class PhishingHandler {
    word: string;
    client: FluorineClient;
    users: string;
    constructor(client: FluorineClient) {
        this.client = client;
        this.users = readFileSync(
            `${__dirname}/../../../assets/users.txt`
        ).toString();
        this.word = readFileSync(
            `${__dirname}/../../../assets/words.txt`
        ).toString();
    }
    async getLink(links: string[]) {
        const request = await fetch(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.client.config.safeBrowsing}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    client: {
                        clientId: 'fluorine',
                        clientVersion: '2.0.0'
                    },
                    threatInfo: {
                        threatTypes: [
                            'MALWARE',
                            'SOCIAL_ENGINEERING',
                            'POTENTIALLY_HARMFUL_APPLICATION'
                        ],
                        platformTypes: ['ANY_PLATFORM'],
                        threatEntryTypes: ['URL', 'IP_RANGE'],
                        threatEntries: links
                    }
                })
            }
        );
        return request.json();
    }
    getWords() {
        return this.word.split('\n');
    }
    getUsers() {
        return this.word.split('\n');
    }
}
