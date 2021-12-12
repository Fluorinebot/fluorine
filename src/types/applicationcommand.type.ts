import FluorineClient from '@classes/Client';
import { CommandInteraction } from 'discord.js';

export interface applicationCommand {
    run: (client: FluorineClient, interaction: CommandInteraction) => void;
    help: {
        name: string;
        category: string;
        aliases: string[];
        description: string;
    };
}
