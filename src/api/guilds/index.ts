import type { FluorineClient } from '#classes';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function handleGuilds(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    const { authorization } = req.headers as { authorization: string };
    if (!authorization) {
        reply.status(401).send({ error: 'Missing token' });
    }

    const { token } = await client.oauth.verify(authorization);
    if (!token) {
        reply.status(401).send({ error: 'Invalid token' });
    }

    return { guilds: await client.oauth.getGuilds(token.access_token) };
}
