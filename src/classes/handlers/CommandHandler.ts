import { readdirSync } from 'fs';
import { Command } from 'types/command';
import { Collection } from 'discord.js';
import FluorineClient from '@classes/Client';
export default class CommandHandler {
    map: Collection<string, Command>;
    client: FluorineClient;
    constructor(client) {
        // import commands
        this.client = client;
        this.map = new Collection();
    }
    loadCommands() {
        const dir = readdirSync(`${__dirname}/../../cmds`);
        dir.forEach(async file => {
            const [name] = file.split('.');
            this.map.set(name, await import(`${__dirname}/../../cmds/${file}`));
        });
        this.client.logger.log(`Loaded ${dir.length} text commands`);
        return this.map;
    }
}
