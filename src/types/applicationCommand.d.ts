import FluorineClient from '@classes/Client';
import { CommandInteraction } from 'discord.js';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';

export interface applicationCommand {
    run: (client: FluorineClient, interaction: CommandInteraction) => void;
    data: RESTPostAPIApplicationCommandsJSONBody;
    help: {
        name: string;
        category: string;
        aliases: string[];
        description: string;
    };
}
