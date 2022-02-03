import { readdirSync } from 'fs';
import { ChatInputCommand, ContextMenuCommand } from 'types/applicationCommand';
import { Collection } from 'discord.js';
import FluorineClient from '@classes/Client';

export default class ApplicationCommandHandler {
    chatInput: Collection<string, ChatInputCommand>;
    contextMenu: Collection<string, ContextMenuCommand>;
    client: FluorineClient;
    constructor(client) {
        // import commands
        this.client = client;
        this.chatInput = new Collection();
        this.contextMenu = new Collection();
    }

    loadChatInput = (): Collection<string, ChatInputCommand> => {
        const dir = readdirSync(`${__dirname}/../../commands`);
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
        this.client.logger.log(`Loaded ${dir.length} chat input commands.`);
        return this.chatInput;
    };

    loadContextMenu = (): Collection<string, ContextMenuCommand> => {
        const dir = readdirSync(`${__dirname}/../../context`);
        dir.forEach(async file => {
            const [name] = file.split('.');
            this.contextMenu.set(
                name,
                await import(`${__dirname}/../../context/${file}`)
            );
        });

        this.client.logger.log(`Loaded ${dir.length} context menu commands.`);
        return this.contextMenu;
    };
}
