import FluorineClient from '@classes/Client';
import { Guild } from 'discord.js';
import { Config } from 'types/databaseTables';

export async function run(client: FluorineClient, guild: Guild) {
    await client.db.query<Config>(
        'INSERT INTO config(guild_id, prefix, logs_enabled, logs_channel, log_moderation_actions, antibot_factor, antibot_action, currency) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [BigInt(guild.id), process.env.DISCORD_PREFIX, true, null, false, 0, 'timeout', '🪙']
    );
}
