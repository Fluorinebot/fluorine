import type { FluorineClient } from '#classes';
import { PermissionsBitField } from 'discord.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function getUser(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    const { id: guildId } = req.params as { id: string };
    const { userId } = req.params as { userId: string };
    const { authorization } = req.cookies;

    const { id: authId } = client.oauth.verify(authorization);
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        return reply.status(404).send({ error: 'Guild not found' });
    }

    const member = await guild.members.fetch(authId);
    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return reply.status(403).send({ error: 'Missing permissions' });
    }

    const { user, nickname, roles } = await guild.members.fetch(userId);

    return {
        tag: user.tag,
        nickname,
        avatar: user.avatar,
        roles: roles.color
    };
}
