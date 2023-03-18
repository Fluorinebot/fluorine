import type { FluorineClient } from '#classes';
import { PermissionsBitField } from 'discord.js';
import type { FastifyRequest, FastifyReply } from 'fastify';

export async function getCases(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
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

    const cases = await client.cases.getGuild(guildId);

    const casesWithIsoString = cases.map(caseData => ({
        ...caseData,
        createdAt: new Date(Number(caseData.createdAt)).toISOString()
    }));

    reply.header('Content-Type', 'application/json');
    reply.send(
        JSON.stringify(casesWithIsoString, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    );
}
