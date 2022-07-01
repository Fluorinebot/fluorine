import { Component } from 'types/structures';
import { Collection } from 'discord.js';
import FluorineClient from '@classes/Client';
import { loadDirectory } from '@util/files';

export default class ComponentHandler extends Collection<string, Component> {
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
