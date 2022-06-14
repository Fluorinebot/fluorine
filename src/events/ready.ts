import FluorineClient from '@classes/Client';
import { Routes } from 'discord-api-types/v10';
import { performance } from 'perf_hooks';

export async function run(client: FluorineClient) {
    const devGuild = client.guilds.cache.get(process.env.DISCORD_DEV_GUILD);
    const commands = await devGuild.commands.fetch();

    if (!commands.some(c => c.name === 'deploy')) {
        const route = Routes.applicationGuildCommands(client.user.id, process.env.DISCORD_DEV_GUILD);
        const command = client.applicationCommands.chatInput.get('deploy');

        await client.restModule.post(route, {
            body: command.data.toJSON()
        });

        client.logger.log(`Enabled deploy commands for guild ID ${process.env.DISCORD_DEV_GUILD}.`);
    }

    client.guilds.cache.forEach(async guild => {
        const config = await client.prisma.config.findMany({
            where: {
                guildId: BigInt(guild.id)
            }
        });

        if (!config.length) {
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
    });

    client.logger.log(`Checked ${client.guilds.cache.size} guilds.`);
    client.logger.log(`Ready in ${((performance.now() - client.createdAt) / 1000).toFixed(2)}s`);
}
