import type { FluorineClient } from '#classes';
import type { Guild } from 'discord.js';

export async function run(client: FluorineClient, guild: Guild) {
    await client.prisma.config.create({
        data: {
            guildId: BigInt(guild.id),
            logsEnabled: false,
            logsChannel: null,
            logModerationActions: false,
            currency: '🪙'
        }
    });
}
