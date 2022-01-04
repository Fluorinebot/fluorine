import FluorineClient from '@classes/Client';
import { MessageComponentInteraction } from 'discord.js';

export interface Component {
    run: (
        client: FluorineClient,
        interaction: MessageComponentInteraction
    ) => void;
}
