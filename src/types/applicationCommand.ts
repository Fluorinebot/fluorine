import FluorineClient from '@classes/Client';
import { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { Collection, CommandInteraction, ContextMenuInteraction } from 'discord.js';

export type Category = 'fun' | 'tools' | 'moderation' | 'economy';

export interface ChatInputCommand {
    run: (client: FluorineClient, interaction: CommandInteraction) => void;
    data: SlashCommandBuilder;
    category: Category;
    dev?: boolean;
}

export interface ContextMenuCommand {
    run: (client: FluorineClient, interaction: ContextMenuInteraction) => void;
    data: ContextMenuCommandBuilder;
    dev?: boolean;
}

export interface ApplicationCommands {
    chatInput: Collection<string, ChatInputCommand>;
    contextMenu: Collection<string, ContextMenuCommand>;
}
