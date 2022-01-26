import FluorineClient from '@classes/Client';
import { CommandInteraction, ContextMenuInteraction } from 'discord.js';
import {
    ContextMenuCommandBuilder,
    SlashCommandBuilder
} from '@discordjs/builders';

export type Category = 'fun' | 'tools' | 'moderation';

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
