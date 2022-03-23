import { readdirSync } from 'fs';
import { Command } from 'types/command';
import { Collection } from 'discord.js';
import FluorineClient from '@classes/Client';
export default class CommandHandler extends Collection<string, Command> {
    client: FluorineClient;
    constructor(client) {
        super();
        this.client = client;
    }
    loadCommands() {
        const dir = readdirSync(`${__dirname}/../../cmds`);
        dir.forEach(async file => {
            if (!file.endsWith('.js')) return;
            const [name] = file.split('.');
            this.set(name, await import(`${__dirname}/../../cmds/${file}`));
        });
        this.client.logger.log(`Loaded ${dir.length} text commands`);
        return this;
    }
}
