import FluorineClient from '@classes/Client';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export interface ApplicationCommand {
    run: (client: FluorineClient, interaction: CommandInteraction) => void;
    data: SlashCommandBuilder;
    help: {
        name: string;
        category: string;
        aliases: string[];
        description: string;
    };
}
