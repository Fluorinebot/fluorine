import { readdirSync } from 'fs';
import {
    ApplicationCommand,
    ContextMenuCommand
} from 'types/applicationCommand';
import { Collection } from 'discord.js';

export default class ApplicationCommandHandler {
    chatInput: Collection<string, ApplicationCommand>;
    contextMenu: Collection<string, ContextMenuCommand>;
    constructor() {
        // import commands
        this.chatInput = new Collection();
        this.contextMenu = new Collection();
    }

    loadChatInput() {
        const dir = readdirSync(`${__dirname}/../../commands`);
        console.log(dir);
        dir.forEach(async file => {
            if (!file.endsWith('.js')) {
                const subcommands = readdirSync(
                    `${__dirname}/../../commands/${file}`
                );
                subcommands.forEach(async subfile => {
                    const [subname] = subfile.split('.');
                    if (subname === 'index') return;
                    this.chatInput.set(
                        `${file}/${subname}`,
                        await import(
                            `${__dirname}/../../commands/${file}/${subname}`
                        )
                    );
                });
            }
            const [name] = file.split('.');
            this.chatInput.set(
                name,
                await import(`${__dirname}/../../commands/${file}`)
            );
        });
        return this.chatInput;
    }

    loadContextMenu() {
        const dir = readdirSync(`${__dirname}/../../cmds`);
        console.log(dir);
        dir.forEach(async file => {
            const [name] = file.split('.');
            this.contextMenu.set(
                name,
                await import(`${__dirname}/../../cmds/${file}`)
            );
        });
        return this.contextMenu;
    }
}
