import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';

export interface Command {
    run: (client: FluorineClient, message: Message, args: string[]) => void;
}
