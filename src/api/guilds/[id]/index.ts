import type { FluorineClient } from '#classes';
import { PermissionsBitField } from 'discord.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function handleGuild(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    const { id: guildId } = req.params as { id: string };
    const { authorization } = req.headers;

    const { id: userId } = client.oauth.verify(authorization);
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        return reply.status(404).send({ error: 'Guild not found' });
    }

    const member = await guild.members.fetch({ user: await client.users.fetch(userId) });
    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return reply.status(403).send({ error: 'Missing permissions' });
    }
    const { currency, logModerationActions, logsChannel, logsEnabled } = await client.prisma.config.findUnique({
        where: { guildId: BigInt(guildId) }
    });
    // get only the important data
    const { id, name, icon } = guild;
    return { id, name, icon, currency, logModerationActions, logsChannel, logsEnabled };
}
