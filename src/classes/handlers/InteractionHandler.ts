import type { FluorineClient } from '#classes';
import type { ChatInputCommand, ChatInputSubcommand, ContextMenuCommand, Command, Modal, Component } from '#types';
import { loadParentDirectory } from '#util';
import type { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

export class InteractionHandler {
    constructor(private client: FluorineClient) {
        this.client = client;
    }

    // SECTION - Merge builders of subcommands with parent commands
    private addFullBuilder(command: ChatInputCommand | ChatInputSubcommand) {
        if (!this.isChatInputCommand(command)) {
            return;
        }

        const subcommandNames = [...this.client.chatInput.keys()].filter(c =>
            c.startsWith(`${command.slashCommandData.name}/`)
        );

        const subcommands = subcommandNames.map(subcommandName => {
            const subcommand = this.client.chatInput.get(subcommandName);

            if (this.isChatInputSubcommand(subcommand)) {
                return subcommand.slashCommandData;
            }
        });

        this.getMergedCommandData(command.slashCommandData, subcommands);
    }

    private getMergedCommandData(base: SlashCommandBuilder, data: SlashCommandSubcommandBuilder[] = []) {
        for (const subcommand of data) {
            if (subcommand) {
                base.addSubcommand(subcommand);
            }
        }

        return base;
    }
    //

    // SECTION - Load commands
    async loadCommands() {
        const [parentCommands, subCommands] = await loadParentDirectory<Command, Command>('../commands');

        const commands = [...parentCommands];
        subCommands.map(subInteraction => commands.push(subInteraction.data));

        // * loads command types that do not have difference when nested.
        for (const command of commands) {
            if (this.isContextMenuCommand(command)) {
                this.client.contextMenu.set(command.contextMenuCommandData.name, command);
            }

            if (this.isComponent(command)) {
                this.client.components.set(command.componentData.name, command);
            }

            if (this.isModal(command)) {
                this.client.modals.set(command.modalData.name, command);
            }
        }

        // * loads command types that have difference in nesting
        for (const parentCommand of parentCommands) {
            if (this.isChatInputCommand(parentCommand)) {
                this.client.chatInput.set(parentCommand.slashCommandData.name, parentCommand);
            }
        }

        for (const subCommand of subCommands) {
            if (this.isChatInputCommand(subCommand.data)) {
                this.client.chatInput.set(subCommand.data.slashCommandData.name, subCommand.data);
            }

            if (this.isChatInputSubcommand(subCommand.data)) {
                const [key] = subCommand.name.endsWith('index') ? subCommand.name.split('/') : [subCommand.name];

                this.client.chatInput.set(key, subCommand.data);
            }
        }

        this.client.chatInput.forEach(c => this.addFullBuilder(c));
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
