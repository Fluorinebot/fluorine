import { readdirSync } from 'fs';
import { Command } from 'types/command';
import { Collection } from 'discord.js';
export default class CommandHandler {
    map: Collection<string, Command>;
    constructor() {
        // import commands
        this.map = new Collection();
    }
    loadCommands() {
        const dir = readdirSync(`${__dirname}/../../cmds`);
        dir.forEach(async file => {
            const [name] = file.split('.');
            this.map.set(name, await import(`${__dirname}/../../cmds/${file}`));
        });
        return this.map;
    }
}
