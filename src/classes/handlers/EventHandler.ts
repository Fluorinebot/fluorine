import FluorineClient from '@classes/Client';
import { loadDirectory } from '@util/files';
import { Event } from 'types/event';

export default class EventHandler {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }

    async loadEvents() {
        const files = await loadDirectory<Event>('../events');
        for (const file of files) {
            this.client.on(file.name, (...event) => {
                file.data.run(this.client, ...event);
            });
        }

        this.client.logger.log(`Loaded ${files.length} events.`);
    }
}
