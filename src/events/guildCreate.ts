import AlcanClient from '@classes/Client';
import { Guild } from 'discord.js';
import r from 'rethinkdb';

export async function run(client: AlcanClient, guild: Guild) {
    r.table('config')
        .insert({ id: guild.id, prefix: client.config.prefix })
        .run(client.conn);
}
