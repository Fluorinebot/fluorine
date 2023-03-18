import type { FluorineClient } from '#classes';
import type { FastifyRequest, FastifyReply } from 'fastify';

export async function tokenCheck(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    const { authorization } = req.cookies;
    if (req.routerPath === '/auth') {
        return;
    }

    if (!authorization) {
        return reply.status(401).send({ error: 'Missing token' });
    }

    try {
        client.oauth.verify(authorization);
    } catch {
        reply.status(401).send({ error: 'Invalid token' });
    }
}
