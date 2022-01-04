import { readFileSync } from 'fs';
export default class PhishingHandler {
    link: string;
    word: string;
    constructor() {
        this.link = readFileSync(
            `${__dirname}/../../../assets/domains.txt`
        ).toString();
        this.word = readFileSync(
            `${__dirname}/../../../assets/words.txt`
        ).toString();
    }
    getLinks() {
        return this.link.split('\n');
    }
    getWords() {
        return this.word.split('\n');
    }
}
