import FluorineClient from '@classes/Client';
import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export interface ApplicationCommand {
    run: (
        client: FluorineClient,
        interaction: ChatInputCommandInteraction
    ) => void;
    data: SlashCommandBuilder;
    help: {
        name: string;
        category: string;
        aliases: string[];
        description: string;
    };
}
