import type { FluorineClient } from '#classes';
import type { Prisma } from '@prisma/client';
import { PermissionsBitField } from 'discord.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function patchEconomy(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    const { id: guildId } = req.params as { id: string };
    const { authorization } = req.cookies;
    const { userId } = req.params as { userId: string };
    const { wallet, bank } = req.body as { wallet: number; bank: number };

    const { id } = client.oauth.verify(authorization);
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        return reply.status(404).send({ error: 'Guild not found' });
    }

    const member = await guild.members.fetch(id);
    if (!member) {
        return reply.status(404).send({ error: 'User not found' });
    }
    if (!member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return reply.status(403).send({ error: 'Missing permissions' });
    }

    if ((wallet !== undefined && typeof wallet !== 'number') || (bank !== undefined && typeof bank !== 'number')) {
        return reply.status(400).send({ error: 'Invalid body' });
    }
    const data: Prisma.Without<Prisma.EconomyProfileUpdateInput, Prisma.EconomyProfileUncheckedUpdateInput> &
        Prisma.EconomyProfileUncheckedUpdateInput = {};
    if (wallet !== undefined) {
        data.walletBal = wallet;
    }
    if (bank !== undefined) {
        data.bankBal = bank;
    }
    await client.economy.table.update({
        where: { guildId_userId: { guildId: BigInt(guildId), userId: BigInt(userId) } },
        data
    });
    reply.send({ wallet, bank });
}
