import { PermissionsBitField } from 'discord.js';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { FluorineClient } from '#classes';

export async function getEconomy(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
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
    const top = await client.economy.getAll(guildId);
    const currency = await client.economy.getCurrency(guildId);
    reply.header('Content-Type', 'application/json');
    reply.send(
        JSON.stringify({ top, currency }, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    );
}
