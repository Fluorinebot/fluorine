import type { FluorineClient } from '#classes';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createVerifier } from 'fast-jwt';
import process from 'node:process';
export async function handleGuilds(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    let { authorization }: { authorization: any } = req.headers as { authorization: string };
    console.log(req.headers);
    if (!authorization) {
        reply.status(401).send({ error: 'Missing token' });
    }
    const decoder = createVerifier({ key: process.env.JWT_SECRET });
    authorization = await decoder(authorization);
    console.log(authorization);
    const { token } = authorization;
    if (!authorization.token) {
        reply.status(401).send({ error: 'Invalid token' });
    }
    console.log(await client.oauth.getGuilds(token.access_token));
    return { guilds: await client.oauth.getGuilds(token.access_token) };
}
