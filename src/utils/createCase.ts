import FluorineClient from '@classes/Client';
import { Guild, User } from 'discord.js';
import r from 'rethinkdb';

export default async function caseCreate(
    client: FluorineClient,
    guild: Guild,
    user: User,
    creator: User,
    type: string,
    dscp: string
) {
    const values = await r
        .table('case')
        .getAll(guild?.id, { index: 'guild' })
        .orderBy(r.desc('id'))
        .limit(1)
        .coerceTo('array')
        .run(client.conn);

    return {
        // eslint-disable-next-line no-unsafe-optional-chaining
        id: values[0]?.id + 1 || 1,
        guild: guild.id,
        user: user.id,
        creator: creator.id,
        type,
        dscp
    };
}
