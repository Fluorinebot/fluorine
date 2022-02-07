import FluorineClient from '@classes/Client';
import { readdirSync } from 'fs';
export class ModuleHandler {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }
    loadModules() {
        const eventModuleDirs = readdirSync(`${__dirname}/../../modules`);
        let count = 0;
        const eventModules = {};

        for (const eventModuleDir of eventModuleDirs) {
            const eventDir = readdirSync(
                `${__dirname}/../../modules/${eventModuleDir}`
            );
            const eventArray = [];

            eventDir.forEach(async event => {
                const code = await import(
                    `${__dirname}/../../modules/${eventModuleDir}/${event}`
                );
                eventArray.push(code);
            });

            eventModules[eventModuleDir] = eventArray;
            count += eventDir.length;
        }

        this.client.logger.log(`Loaded ${count} modules.`);
        return eventModules;
    }
}
export async function setup(client: FluorineClient) {
    client.modules = new ModuleHandler(client).loadModules();
}
