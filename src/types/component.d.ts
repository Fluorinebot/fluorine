import FluorineClient from '@classes/Client';
import { MessageComponentInteraction } from 'discord.js';

export interface Component {
    authorOnly: boolean;
    run: (client: FluorineClient, interaction: MessageComponentInteraction, value: string) => void;
}
