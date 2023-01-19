import type { FluorineClient } from '#classes';
import type { ChatInputCommand, ChatInputSubcommand, ContextMenuCommand, Command, Modal, Component } from '#types';
import { loadParentDirectory } from '#util';
import type { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

export class CommandHandler {
    constructor(private client: FluorineClient) {
        this.client = client;
    }

    // SECTION - Merge builders of subcommands with parent commands
    private addFullBuilder(command: ChatInputCommand | ChatInputSubcommand) {
        if (!this.isChatInputCommand(command)) {
            return;
        }

        const subcommandNames = [...this.client.chatInputCommands.keys()].filter(c =>
            c.startsWith(`${command.slashCommandData.builder.name}/`)
        );

        const subcommands = subcommandNames.map(subcommandName => {
            const subcommand = this.client.chatInputCommands.get(subcommandName);

            if (this.isChatInputSubcommand(subcommand)) {
                return subcommand.slashCommandData.builder;
            }
        });

        this.getMergedCommandData(command.slashCommandData.builder, subcommands);
    }

    private getMergedCommandData(base: SlashCommandBuilder, data: SlashCommandSubcommandBuilder[] = []) {
        for (const subcommand of data) {
            if (subcommand) {
                base.addSubcommand(subcommand);
            }
        }

        return base;
    }
    // !SECTION

    // SECTION - Load commands
    async loadCommands() {
        const [parentCommands, subcommands] = await loadParentDirectory<Command, Command>('../commands');

        const commands = [...parentCommands, ...subcommands.map(s => s.data)];

        // * loads command types that do not have difference when nested.
        for (const command of commands) {
            if (this.isChatInputCommand(command)) {
                this.client.chatInputCommands.set(command.slashCommandData.builder.name, command);
            }

            if (this.isContextMenuCommand(command)) {
                this.client.contextMenuCommands.set(command.contextMenuCommandData.builder.name, command);
            }

            if (this.isComponent(command)) {
                this.client.components.set(command.componentData.name, command);
            }

            if (this.isModal(command)) {
                this.client.modals.set(command.modalData.name, command);
            }
        }

        for (const subcommand of subcommands) {
            if (this.isChatInputSubcommand(subcommand.data)) {
                const [key] = subcommand.name.endsWith('index') ? subcommand.name.split('/') : [subcommand.name];

                this.client.chatInputCommands.set(key, subcommand.data);
            }
        }

        this.client.chatInputCommands.forEach(c => this.addFullBuilder(c));
        this.client.logger.log(`Loaded ${parentCommands.length} interactions.`);
    }
    // !SECTION

    // SECTION - Type checking functions
    isChatInputCommand(command: Command): command is ChatInputCommand {
        return 'slashCommandData' in command && 'category' in command;
    }

    isChatInputSubcommand(command: Command): command is ChatInputSubcommand {
        return 'slashCommandData' in command && !('category' in command);
    }

    isContextMenuCommand(command: Command): command is ContextMenuCommand {
        return 'contextMenuCommandData' in command;
    }

    isComponent(command: Command): command is Component {
        return 'componentData' in command;
    }

    isModal(command: Command): command is Modal {
        return 'modalData' in command;
    }
    // !SECTION
}
