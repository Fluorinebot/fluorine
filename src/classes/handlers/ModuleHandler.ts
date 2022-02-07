import FluorineClient from '@classes/Client';
import { readdirSync } from 'fs';
export class ModuleHandler {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }
    loadModules() {
        const dir = readdirSync(`${__dirname}/../../modules`);
        console.log(dir);
        const events = [];
        let count = 0;
        const obj = {};
        for (const file of dir) {
            events.push(file);
        }
        events.forEach(async event => {
            const eventDir = readdirSync(`${__dirname}/../../modules/${event}`);
            const eventArray = [];
            for (const file of eventDir) {
                const code = await import(
                    `${__dirname}/../../modules/${event}/${file}`
                );
                eventArray.push(code);
                count++;
            }
            obj[event] = eventArray;
        });
        this.client.logger.log(`Loaded ${count} modules.`);
        return obj;
    }
}
export async function setup(client: FluorineClient) {
    client.modules = new ModuleHandler(client).loadModules();
}
