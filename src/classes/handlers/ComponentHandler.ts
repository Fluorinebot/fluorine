import { readdirSync } from 'fs';
import { Component } from 'types/component';
import { Collection } from 'discord.js';
import FluorineClient from '@classes/Client';
export default class ComponentHandler {
    client: FluorineClient;
    map: Collection<string, Component>;
    constructor(client) {
        this.client = client;
        this.map = new Collection();
    }
    loadComponents() {
        const dir = readdirSync(`${__dirname}/../../components`);
        dir.forEach(async file => {
            const [name] = file.split('.');
            this.map.set(
                name,
                await import(`${__dirname}/../../components/${file}`)
            );
        });
        this.client.logger.log(`Loaded ${dir.length} components.`);
        return this.map;
    }
}
