import { readdirSync } from 'fs';
import { applicationCommand } from 'types/applicationcommand.type';
export default class ApplicationCommandHandler {
    map: Map<string, applicationCommand>;
    constructor() {
        // import commands
        this.map = new Map();
    }
    loadCommands() {
        const dir = readdirSync(`${__dirname}/../../commands`);
        console.log(dir);
        dir.forEach(async file => {
            const [name] = file.split('.');
            this.map.set(
                name,
                await import(`${__dirname}/../../commands/${file}`)
            );
        });
        return this.map;
    }
}
