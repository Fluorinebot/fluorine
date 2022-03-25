import FluorineClient from '@classes/Client';
import { performance } from 'perf_hooks';
import { Config } from 'types/databaseTables';

export async function run(client: FluorineClient) {
    client.guilds.cache.forEach(async g => {
        const guild = (
            await client.db.query<Config>('SELECT logs_enabled FROM config WHERE guild_id = $1', [BigInt(g.id)])
        ).rows;

        if (guild.length === 0) {
            await client.db.query<Config>(
                'INSERT INTO config(guild_id, prefix, logs_enabled, logs_channel, log_moderation_actions, antibot_factor, antibot_action, currency) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [BigInt(g.id), process.env.DISCORD_PREFIX, true, null, false, 0, 'timeout', '🪙']
            );
        }
    });

    client.logger.log(`Checked ${client.guilds.cache.size} guilds.`);
    client.logger.log(`Ready in ${((performance.now() - client.createdAt) / 1000).toFixed(2)}s`);
}
