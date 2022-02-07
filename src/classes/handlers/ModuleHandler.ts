import FluorineClient from '@classes/Client';
import { readdirSync } from 'fs';
export class ModuleHandler {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }
    loadModules() {
        const dir = readdirSync('../../modules');
        const events = [];
        letcount = 0;
        const obj = {};
        for (const file of dir) {
            events.push(file);
        }
        events.forEach(async event => {
            const eventDir = readdirSync(`../../modules/${event}`);
            const eventArray = [];
            for (const file of eventDir) {
                const code = await import(`../../modules/${event}/${file}`);
                eventArray.push(code);
            }
            obj[event] = eventArray;
            count++;
        });
        this.client.logger.log(`Loaded ${count} modules.`);
        return obj;
    }
}
export async function setup(client: FluorineClient) {
    client.modules = new ModuleHandler(client).loadModules();
}
