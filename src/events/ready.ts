import type FluorineClient from '#classes/Client';
import { Routes } from 'discord-api-types/v10';
import { performance } from 'perf_hooks';

export async function run(client: FluorineClient) {
    const route = Routes.applicationGuildCommands(client.user.id, process.env.DISCORD_DEV_GUILD);
    const command = client.commands.chatInput.get('deploy');

    await client.rest.post(route, {
        body: command.data.toJSON()
    });

    client.logger.log(`Enabled deploy commands for guild ID ${process.env.DISCORD_DEV_GUILD}.`);

    client.cache.guilds.forEach(async guild => {
        await client.prisma.config.upsert({
            where: {
                guildId: BigInt(guild.id)
            },
            create: {
                guildId: BigInt(guild.id),
                prefix: process.env.DISCORD_PREFIX,
                logsEnabled: false,
                logsChannel: null,
                logModerationActions: false,
                antibotFactor: 0,
                antibotAction: 'timeout'
            },
            update: {}
        });
    });

    client.logger.log(`Checked ${client.cache.guilds.size} guilds.`);
    client.logger.log(`Ready in ${((performance.now() - client.createdAt) / 1000).toFixed(2)}s`);
}
