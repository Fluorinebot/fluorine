import { readdirSync } from 'fs';
import { ApplicationCommand } from 'types/applicationCommand';
import { Collection } from 'discord.js';
export default class ApplicationCommandHandler {
    map: Collection<string, ApplicationCommand>;
    constructor() {
        // import commands
        this.map = new Collection();
    }
    loadCommands() {
        const dir = readdirSync(`${__dirname}/../../commands`);
        console.log(dir);
        dir.forEach(async file => {
            if (!file.endsWith('.js')) {
                const subcommands = readdirSync(
                    `${__dirname}/../../commands/${file}`
                );
                subcommands.forEach(async subfile => {
                    const [subname] = subfile.split('.');
                    this.map.set(
                        `${file}/${subname}`,
                        await import(
                            `${__dirname}/../../commands/${file}/${subname}`
                        )
                    );
                });
            }
            const [name] = file.split('.');
            this.map.set(
                name,
                await import(`${__dirname}/../../commands/${file}`)
            );
        });
        return this.map;
    }
}
