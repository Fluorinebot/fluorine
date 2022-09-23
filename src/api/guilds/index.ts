import type { FluorineClient } from '#classes';
import type { FastifyRequest } from 'fastify';

export async function handleGuilds(client: FluorineClient, req: FastifyRequest) {
    const { authorization } = req.headers as { authorization: string };
    const { token } = await client.oauth.verify(authorization);

    return { guilds: await client.oauth.getGuilds(token.access_token) };
}
