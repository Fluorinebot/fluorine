import { readdirSync } from 'fs';
import { command } from 'types/command.type';
export default class CommandHandler {
    map: Map<string, command>;
    constructor() {
        // import commands
        this.map = new Map();
    }
    loadCommands() {
        const dir = readdirSync(`${__dirname}/../../cmds`);
        console.log(dir);
        dir.forEach(async file => {
            const [name] = file.split('.');
            this.map.set(name, await import(`${__dirname}/../../cmds/${file}`));
        });
        return this.map;
    }
}
