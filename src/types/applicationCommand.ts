import FluorineClient from '@classes/Client';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export type Category = 'fun' | 'tools' | 'moderation' | 'economy';

export interface ApplicationCommand {
    run: (client: FluorineClient, interaction: CommandInteraction) => void;
    data: SlashCommandBuilder;
    category: Category;
    dev?: boolean;
}
