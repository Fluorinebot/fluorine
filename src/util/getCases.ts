import AlcanClient from '@classes/Client';
import r from 'rethinkdb';

export default async function getCases(
  client: AlcanClient,
  guild: string,
  user: string
) {
  const toReturn = await r
    .table('case')
    .getAll([user, guild], { index: 'user' })
    .orderBy(r.asc('id'))
    .coerceTo('array')
    .run(client.conn);
  return toReturn;
}
