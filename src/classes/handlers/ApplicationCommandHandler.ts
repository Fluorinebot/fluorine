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
        const dir = readdirSync(`${__dirname}/../../slash`);
        console.log(dir);
        dir.forEach(async file => {
            if (!file.endsWith('.js')) {
                const subcommands = readdirSync(
                    `${__dirname}/../../slash/${file}`
                );
                subcommands.forEach(async subfile => {
                    const [subname] = subfile.split('.');
                    if (subname === 'index') return;
                    this.map.set(
                        `${file}/${subname}`,
                        await import(
                            `${__dirname}/../../slash/${file}/${subname}`
                        )
                    );
                });
            }
            const [name] = file.split('.');
            this.map.set(
                name,
                await import(`${__dirname}/../../slash/${file}`)
            );
        });
        return this.map;
    }
}
