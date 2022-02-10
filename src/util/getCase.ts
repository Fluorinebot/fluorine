import FluorineClient from '@classes/Client';
import { Guild } from 'discord.js';
import r from 'rethinkdb';

export default async function caseGet(client: FluorineClient, guild: Guild, nr: number) {
    return (
        r
            .table('case')
            // @ts-ignore
            .getAll([guild.id, nr], { index: 'case' })
            .coerceTo('array')
            .run(client.conn)
    );
}
