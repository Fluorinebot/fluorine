import FluorineClient from '@classes/Client';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
export class PhishingHandler {
    word: string;
    client: FluorineClient;
    users: string;
    links: string;

    constructor(client: FluorineClient) {
        this.client = client;
        this.users = readFileSync(
            `${__dirname}/../../../assets/users.txt`
        ).toString();
        this.word = readFileSync(
            `${__dirname}/../../../assets/words.txt`
        ).toString();
        this.links = readFileSync(
            `${__dirname}/../../../assets/links.txt`
        ).toString();
    }
    getLink(link: string) {
        const hash = createHash('sha256').update(link).digest('hex');
        return this.links.split('\n').includes(hash);
    }
    getWords() {
        return this.word.split('\n');
    }
    getUsers() {
        return this.users.split('\n');
    }
}

export async function setup(client: FluorineClient) {
    client.phishing = new PhishingHandler(client);
}
