import type { FluorineClient } from '#classes';
import { PermissionFlagsBits } from 'discord.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function patchCase(client: FluorineClient, req: FastifyRequest, res: FastifyReply) {
    const { id: guildId, case: caseId } = req.params as { id: string; case: string };
    const { id: userId } = await client.oauth.verify(req.headers.authorization);
    const member = await client.guilds.cache.get(guildId)?.members.fetch(userId);
    if (!member) {
        return res.status(404).send({ error: 'Guild not found' });
    }
    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return res.status(403).send({ error: 'Missing permissions' });
    }
    const { reason } = req.body as { reason: string };
    if (!reason) {
        return res.status(400).send({ error: 'Invalid body' });
    }
    const caseData = await client.cases.getOne(guildId, parseInt(caseId));
    if (!caseData) {
        return res.status(404).send({ error: 'Case not found' });
    }
    await client.cases.editReason(guildId, parseInt(caseId), reason);
    res.status(204).send();
}
export async function getCase(client: FluorineClient, req: FastifyRequest, res: FastifyReply) {
    const { id: guildId, case: caseId } = req.params as { id: string; case: string };
    const { id: userId } = await client.oauth.verify(req.headers.authorization);
    const member = await client.guilds.cache.get(guildId)?.members.fetch(userId);
    if (!member) {
        return res.status(404).send({ error: 'Guild not found' });
    }
    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return res.status(403).send({ error: 'Missing permissions' });
    }
    const caseData = await client.cases.getOne(guildId, parseInt(caseId));
    if (!caseData) {
        return res.status(404).send({ error: 'Case not found' });
    }
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(caseData, (key, value) => (typeof value === 'bigint' ? value.toString() : value)));
}
export async function deleteCase(client: FluorineClient, req: FastifyRequest, res: FastifyReply) {
    const { id: guildId, case: caseId } = req.params as { id: string; case: string };
    const { id: userId } = await client.oauth.verify(req.headers.authorization);
    const member = await client.guilds.cache.get(guildId)?.members.fetch(userId);
    if (!member) {
        return res.status(404).send({ error: 'Guild not found' });
    }
    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return res.status(403).send({ error: 'Missing permissions' });
    }
    const caseData = await client.cases.getOne(guildId, parseInt(caseId));
    if (!caseData) {
        return res.status(404).send({ error: 'Case not found' });
    }
    await client.cases.delete(guildId, parseInt(caseId));
    res.status(204).send();
}
