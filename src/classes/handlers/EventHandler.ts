import FluorineClient from '@classes/Client';
import { readdirSync } from 'fs';

export default class EventHandler {
    constructor(client: FluorineClient) {
        // import events
        const dir = readdirSync(`${__dirname}/../../events`);
        dir.forEach(async event => {
            const [name] = event.split('.');
            const code: any = await import(
                `${__dirname}/../../events/${event}`
            );
            client.on(name, (...event) => {
                code.run(client, ...event);
            });
        });
        client.logger.log(`Loaded ${dir.length} events.`);
    }
}
export async function setup(client: FluorineClient) {
    new EventHandler(client);
}
