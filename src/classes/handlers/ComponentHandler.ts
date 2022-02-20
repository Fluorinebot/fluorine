import { Component } from 'types/component';
import { Collection } from 'discord.js';
import FluorineClient from '@classes/Client';
import { loadDirectory } from '@util/files';
export default class ComponentHandler {
    client: FluorineClient;
    components = new Collection<string, Component>();
    constructor(client) {
        this.client = client;
    }
    async loadComponents() {
        const files = await loadDirectory<Component>('../components');
        for (const file of files) {
            this.components.set(file.name, file.data);
        }

        this.client.logger.log(`Loaded ${files.length} components.`);
        return this.components;
    }
}
