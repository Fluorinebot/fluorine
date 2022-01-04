import { readFileSync } from 'fs';
export default class LinkHandler {
    link: string;
    constructor() {
        this.link = readFileSync(`${__dirname}/../../config.json`).toString();
    }
    getLinks() {
        return this.link.split('\n');
    }
}
