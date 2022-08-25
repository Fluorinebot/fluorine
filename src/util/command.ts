import type FluorineClient from '#classes/Client';
import { type Snowflake } from 'discord.js';

export type CommandMention = `</${string}:${Snowflake}>` | `/${string}`;

export async function getCommandMention(client: FluorineClient, name: string): Promise<CommandMention> {
    const command = client.application.commands.cache.find(c => c.name === name.split(' ')[0]);

    return command ? `</${name}:${command.id}>` : `/${name}`;
}
