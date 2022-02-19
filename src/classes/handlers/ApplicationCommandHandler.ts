import { ChatInputCommand, ChatInputSubcommand, ContextMenuCommand } from 'types/applicationCommand';
import { Collection } from 'discord.js';
import FluorineClient from '@classes/Client';
import { loadDirectory, loadParentDirectory } from '@util/files';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';

export default class ApplicationCommandHandler {
    client: FluorineClient;
    chatInput = new Collection<string, ChatInputCommand | ChatInputSubcommand>();
    contextMenu = new Collection<string, ContextMenuCommand>();

    constructor(client: FluorineClient) {
        this.client = client;
    }

    getMergedCommandData(base: SlashCommandBuilder, data: SlashCommandSubcommandBuilder[]) {
        for (const subcommand of data) {
            if (subcommand) {
                base.addSubcommand(subcommand);
            }
        }

        return base;
    }

    loadChatInput = async () => {
        const [commands, subcommands] = await loadParentDirectory<ChatInputCommand, ChatInputSubcommand>('../commands');

        for (const command of commands) {
            this.chatInput.set(command.data.name, command);
        }

        for (const subcommand of subcommands) {
            const [name] = subcommand.name.split('.');
            const [key] = name.endsWith('index') ? name.split('/') : [name];

            this.chatInput.set(key, subcommand.data);
        }

        // TODO: count base subcommands too
        this.client.logger.log(`Loaded ${commands.length} chat input commands.`);
        return this.chatInput;
    };

    loadContextMenu = async () => {
        const files = await loadDirectory<ContextMenuCommand>('../context');
        for (const file of files) {
            this.contextMenu.set(file.name, file.data);
        }

        this.client.logger.log(`Loaded ${files.length} context menu commands.`);
        return this.contextMenu;
    };
}
