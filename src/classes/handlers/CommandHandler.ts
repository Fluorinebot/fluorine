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
        const dir = readdirSync(`${__dirname}/../../slash`);
        console.log(dir);
        dir.forEach(async file => {
            const [name] = file.split('.');
            this.map.set(
                name,
                await import(`${__dirname}/../../slash/${file}`)
            );
        });
        return this.map;
    }
}
