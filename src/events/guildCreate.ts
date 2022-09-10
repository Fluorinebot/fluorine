import process from 'node:process';
import type { FluorineClient } from '#classes';
import type { Guild } from 'discord.js';

export async function run(client: FluorineClient, guild: Guild) {
    await client.prisma.config.create({
        data: {
            guildId: BigInt(guild.id),
            prefix: process.env.DISCORD_PREFIX,
            logsEnabled: false,
            logsChannel: null,
            logModerationActions: false,
            antibotFactor: 0,
            antibotAction: 'timeout'
        }
    });
}
