import FluorineClient from '@classes/Client';
import r from 'rethinkdb';

export async function run(client: FluorineClient) {
    client.guilds.cache.forEach(async g => {
        const guild = await r.table('config').get(g.id).run(client.conn);
        if (!guild) {
            r.table('config')
                .insert({
                    id: g.id,
                    prefix: process.env.DISCORD_PREFIX
                })
                .run(this.conn);
        }
    });

    client.logger.log(`Checked ${client.guilds.cache.size} guilds.`);
    client.logger.log('Ready!');
}
