import type { FluorineClient } from '#classes';
import type { Component } from '#types';
import { loadDirectory } from '#util';
import { Collection } from 'discord.js';

export class ComponentHandler extends Collection<string, Component> {
    constructor(private client: FluorineClient) {
        super();
    }

    async loadComponents() {
        const files = await loadDirectory<Component>('../components');

        for (const file of files) {
            this.set(file.name, file.data);
        }

        this.client.logger.log(`Loaded ${files.length} components.`);
        return this;
    }
}
