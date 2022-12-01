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
                    return subcommand.slashCommandData as SlashCommandSubcommandBuilder;
                }
            });

            this.getMergedCommandData(command.slashCommandData as unknown as SlashCommandBuilder, subcommands);
        }
    }

    private getMergedCommandData(base: SlashCommandBuilder, data: SlashCommandSubcommandBuilder[] = []) {
        for (const subcommand of data) {
            if (subcommand) {
                base.addSubcommand(subcommand);
            }
        }

        this.client.logger.log('h', base);

        return base;
    }

    async loadInteractions() {
        const [parentInteractions, subInteractions] = await loadParentDirectory<InteractionPartial, InteractionPartial>(
            '../interactions'
        );

        const interactions = [...parentInteractions];
        subInteractions.map(subInteraction => interactions.push(subInteraction.data));

        for (const interaction of interactions) {
            if (this.isContextMenuCommand(interaction)) {
                this.client.contextMenu.set(interaction.contextMenuCommandData.name, interaction);
            }

            if (this.isComponent(interaction)) {
                this.client.components.set(interaction.componentData.name, interaction);
            }

            if (this.isModal(interaction)) {
                this.client.modals.set(interaction.modalData.name, interaction);
            }
        }

        for (const parentInteraction of parentInteractions) {
            if (this.isChatInputCommand(parentInteraction)) {
                this.client.chatInput.set(parentInteraction.slashCommandData.name, parentInteraction);
            }
        }

        for (const subInteraction of subInteractions) {
            if (this.isChatInputSubcommand(subInteraction.data)) {
                const [key] = subInteraction.name.endsWith('index')
                    ? subInteraction.name.split('/')
                    : [subInteraction.name];

                this.client.chatInput.set(key, subInteraction.data);
            }
        }

        this.client.chatInput.forEach(c => this.addFullBuilder(c));
        this.client.logger.log(`Loaded ${parentInteractions.length} interactions.`);
    }

    isChatInputCommand(interaction: InteractionPartial): interaction is ChatInputCommand {
        // eslint-disable-next-line dot-notation
        return 'slashCommandData' in interaction && 'slashCommandProps'['category'] in interaction;
    }

    isChatInputSubcommand(interaction: InteractionPartial): interaction is ChatInputSubcommand {
        // eslint-disable-next-line dot-notation
        return 'slashCommandData' in interaction && !('slashCommandProps'['category'] in interaction);
    }

    isContextMenuCommand(interaction: InteractionPartial): interaction is ContextMenuCommand {
        return 'contextMenuCommandData' in interaction;
    }

    isComponent(interaction: InteractionPartial): interaction is Component {
        return 'componentData' in interaction;
    }

    isModal(interaction: InteractionPartial): interaction is Modal {
        return 'modalData' in interaction;
    }
}
