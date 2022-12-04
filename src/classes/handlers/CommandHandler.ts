import type { FluorineClient } from '#classes';
import type { ChatInputCommand, ChatInputSubcommand, ContextMenuCommand } from '#types';
import { loadDirectory, loadParentDirectory } from '#util';
import { Collection, type SlashCommandBuilder, type SlashCommandSubcommandBuilder } from 'discord.js';

export class CommandHandler {
    chatInput = new Collection<string, ChatInputCommand | ChatInputSubcommand>();
    contextMenu = new Collection<string, ContextMenuCommand>();

    constructor(private client: FluorineClient) {
        this.client = client;
    }

    private addFullBuilder(command: ChatInputCommand | ChatInputSubcommand) {
        if ('category' in command) {
            const subcommandNames = [...this.chatInput.keys()].filter((c) => c.startsWith(`${command.data.name}/`));

            const subcommands = subcommandNames.map((subcommandName) => {
                const subcommand = this.chatInput.get(subcommandName);
                if (!('category' in subcommand)) {
                    return subcommand.data;
                }
            });

            this.getMergedCommandData(command.data, subcommands);
        }
    }

    private getMergedCommandData(base: SlashCommandBuilder, data: SlashCommandSubcommandBuilder[] = []) {
        for (const subcommand of data) {
            if (subcommand) {
                base.addSubcommand(subcommand);
            }
        }

        return base;
    }

    async loadChatInput() {
        const [commands, subcommands] = await loadParentDirectory<ChatInputCommand, ChatInputSubcommand>('../commands');

        for (const command of commands) {
            this.chatInput.set(command.data.name, command);
        }

        for (const subcommand of subcommands) {
            const [key] = subcommand.name.endsWith('index') ? subcommand.name.split('/') : [subcommand.name];
            this.chatInput.set(key, subcommand.data);
        }

        this.chatInput.forEach((c) => this.addFullBuilder(c));

        const commandsLoaded = [...this.chatInput.keys()].filter((key) => !key.includes('/'));
        this.client.logger.log(`Loaded ${commandsLoaded.length} chat input commands.`);
        return this.chatInput;
    }

    async loadContextMenu() {
        const files = await loadDirectory<ContextMenuCommand>('../context');
        for (const file of files) {
            this.contextMenu.set(file.data.data.name, file.data);
        }

        this.client.logger.log(`Loaded ${files.length} context menu commands.`);
        return this.contextMenu;
    }
}
