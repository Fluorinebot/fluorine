import type { FastifyRequest, FastifyReply } from 'fastify';
import type { FluorineClient } from '../classes';

export async function tokenCheck(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    const { authorization } = req.headers;
    if (!authorization) {
        return reply.status(401).send({ error: 'Missing token' });
    }
    try {
        client.oauth.verify(authorization);
    } catch {
        reply.status(401).send({ error: 'Invalid token' });
    }
}
