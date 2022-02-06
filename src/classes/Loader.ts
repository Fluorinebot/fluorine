import { readdirSync } from 'fs';
import { Handler } from 'types/handler';
import FluorineClient from './Client';
export default class Loader {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }
    load() {
        const dir = readdirSync(`${__dirname}/handlers`);
        dir.forEach(async file => {
            const code: Handler = await import(`${__dirname}/handlers/${file}`);
            code.setup(this.client);
        });
    }
}
