import type { FluorineClient } from '#classes';
import type {
    ChatInputCommand,
    ChatInputSubcommand,
    ContextMenuCommand,
    InteractionPartial,
    Modal,
    Component
} from '#types';
import { loadParentDirectory } from '#util';
import { Collection, type SlashCommandBuilder, type SlashCommandSubcommandBuilder } from 'discord.js';

export class InteractionHandler {
    chatInput = new Collection<string, ChatInputCommand | ChatInputSubcommand>();
    contextMenu = new Collection<string, ContextMenuCommand>();

    constructor(private client: FluorineClient) {
        this.client = client;
    }

    private addFullBuilder(command: ChatInputCommand | ChatInputSubcommand) {
        if (this.isChatInputCommand(command)) {
            const subcommandNames = [...this.chatInput.keys()].filter(c =>
                c.startsWith(`${command.slashCommandData.name}/`)
            );

            const subcommands = subcommandNames.map(subcommandName => {
                const subcommand = this.chatInput.get(subcommandName);

                if (this.isChatInputSubcommand(subcommand)) {
                    return subcommand.slashCommandData;
                }
            });

            this.getMergedCommandData(command.slashCommandData, subcommands);
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

    async loadInteractions() {
        const [parentInteractions, subInteractions] = await loadParentDirectory<InteractionPartial, InteractionPartial>(
            '../interactions'
        );

        for (const interaction of parentInteractions) {
            if (this.isChatInputCommand(interaction)) {
                this.client.chatInput.set(interaction.slashCommandData.name, interaction);
            }

            if (this.isContextMenuCommand(interaction)) {
                this.client.contextMenu.set(interaction.contextMenuCommandData.name, interaction);
            }

            if (this.isComponent(interaction)) {
                this.client.components.set(interaction.name, interaction);
            }

            if (this.isModal(interaction)) {
                this.client.modals.set(interaction.name, interaction);
            }
        }

        for (const interaction of subInteractions) {
            if (this.isChatInputSubcommand(interaction)) {
                const [key] = interaction.name.endsWith('index') ? interaction.name.split('/') : [interaction.name];
                this.client.chatInput.set(key, interaction);
            }

            if (this.isContextMenuCommand(interaction)) {
                this.client.contextMenu.set(interaction.contextMenuCommandData.name, interaction);
            }

            if (this.isComponent(interaction)) {
                this.client.components.set(interaction.name, interaction);
            }

            if (this.isModal(interaction)) {
                this.client.modals.set(interaction.name, interaction);
            }
        }

        this.client.chatInput.forEach(c => this.addFullBuilder(c));

        this.client.logger.log('Loaded commands');
    }

    isChatInputCommand(interaction: InteractionPartial): interaction is ChatInputCommand {
        return 'slashCommandData' in interaction && 'category' in interaction;
    }

    isChatInputSubcommand(interaction: InteractionPartial): interaction is ChatInputSubcommand {
        return 'slashCommandData' in interaction && !('category' in interaction);
    }

    isContextMenuCommand(interaction: InteractionPartial): interaction is ContextMenuCommand {
        return 'contextMenuCommandData' in interaction;
    }

    isComponent(interaction: InteractionPartial): interaction is Component {
        return 'hasComponent' in interaction;
    }

    isModal(interaction: InteractionPartial): interaction is Modal {
        return 'hasModal' in interaction;
    }
}
