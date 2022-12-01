import { performance } from 'node:perf_hooks';
import process from 'node:process';
import type { FluorineClient } from '#classes';
import { Routes } from 'discord.js';

export async function run(client: FluorineClient) {
    const devGuild = client.guilds.cache.get(process.env.DISCORD_DEV_GUILD);
    const commands = await devGuild.commands.fetch();

    if (!commands.some(c => c.name === 'd')) {
        const route = Routes.applicationGuildCommands(client.user.id, process.env.DISCORD_DEV_GUILD);
        const command = client.chatInput.get('deploy');

        await client.rest.post(route, {
            body: command.slashCommandData.toJSON()
        });

        client.logger.log(`Enabled deploy commands for guild ID ${process.env.DISCORD_DEV_GUILD}.`);
    }

    client.guilds.cache.forEach(async guild => {
        await client.prisma.config.upsert({
            where: {
                guildId: BigInt(guild.id)
            },
            create: {
                guildId: BigInt(guild.id),
                logsEnabled: false,
                logsChannel: null,
                logModerationActions: false
            },
            update: {}
        });
    });

    client.logger.log(`Checked ${client.guilds.cache.size} guilds.`);
    client.logger.log(`Ready in ${((performance.now() - client.createdAt) / 1000).toFixed(2)}s`);
}
