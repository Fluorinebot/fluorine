import type { FluorineClient } from '#classes';
import { PermissionsBitField } from 'discord.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function getGuild(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    const { id: guildId } = req.params as { id: string };
    const { authorization } = req.cookies;

    const { id: userId } = client.oauth.verify(authorization);
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        return reply.status(404).send({ error: 'Guild not found' });
    }

    const member = await guild.members.fetch(userId);
    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return reply.status(403).send({ error: 'Missing permissions' });
    }
    const { logModerationActions, logsChannel, logsEnabled } = await client.prisma.config.findUnique({
        where: { guildId: BigInt(guildId) },
        select: { logModerationActions: true, logsChannel: true, logsEnabled: true }
    });
    // get only the important data
    const { name, icon } = guild;
    reply.header('Content-Type', 'application/json');
    reply.send(
        JSON.stringify({ name, icon, logModerationActions, logsChannel, logsEnabled }, (k, v) =>
            typeof v === 'bigint' ? v.toString() : v
        )
    );
}

export async function patchGuild(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    const { id: guildId } = req.params as { id: string };
    const { authorization } = req.cookies;

    const { id: userId } = client.oauth.verify(authorization);
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        return reply.status(404).send({ error: 'Guild not found' });
    }

    const member = await guild.members.fetch(userId);
    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return reply.status(403).send({ error: 'Missing permissions' });
    }
    const { logModerationActions, logsChannel, logsEnabled } = req.body as {
        logModerationActions?: boolean;
        logsChannel?: string;
        logsEnabled?: boolean;
    };
    if (
        (logModerationActions !== undefined && typeof logModerationActions !== 'boolean') ||
        (logsEnabled !== undefined && typeof logsEnabled !== 'boolean') ||
        (logsChannel && typeof logsChannel !== 'string')
    ) {
        return reply.status(400).send({ error: 'Invalid body' });
    }
    const data: Record<string, unknown> = {};
    if (logModerationActions !== undefined) {
        data.logModerationActions = logModerationActions;
    }
    if (logsChannel) {
        data.logsChannel = BigInt(logsChannel);
    }
    if (logsEnabled !== undefined) {
        data.logsEnabled = logsEnabled;
    }
    await client.prisma.config.update({
        where: { guildId: BigInt(guildId) },
        data
    });
    reply.status(204).send();
}
