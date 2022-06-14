import FluorineClient from '@classes/Client';
import { Guild } from 'discord.js';

export async function run(client: FluorineClient, guild: Guild) {
    client.prisma.config.create({
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
