import type { FluorineClient } from '#classes';
import type { Modal } from '#types';
import { loadDirectory } from '#util';
import { Collection } from 'discord.js';

export class ModalHandler extends Collection<string, Modal> {
    constructor(private client: FluorineClient) {
        super();
    }

    async loadModals() {
        const files = await loadDirectory<Modal>('../modals');

        for (const file of files) {
            this.set(file.name, file.data);
        }

        this.client.logger.log(`Loaded ${files.length} modals.`);
        return this;
    }
}
