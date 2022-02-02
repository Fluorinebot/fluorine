import FluorineClient from '@classes/Client';
import { Guild } from 'discord.js';
import r from 'rethinkdb';

export async function run(client: FluorineClient, guild: Guild) {
    r.table('config')
        .insert({ id: guild.id, prefix: process.env.DISCORD_PREFIX })
        .run(client.conn);
}
