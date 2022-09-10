import type { FluorineClient } from '#classes';
import { loadDirectory } from '#util';
import type { Event } from '#types';

export class EventHandler {
    constructor(private client: FluorineClient) {
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
