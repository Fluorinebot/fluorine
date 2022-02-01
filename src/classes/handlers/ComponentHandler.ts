import { readdirSync } from 'fs';
import { Component } from 'types/component';
import { Collection } from 'discord.js';
export default class ComponentHandler {
    map: Collection<string, Component>;
    constructor() {
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
        return this.map;
    }
}
