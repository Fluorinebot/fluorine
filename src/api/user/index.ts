import type { FluorineClient } from '#classes';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function getOauthUser(client: FluorineClient, req: FastifyRequest, res: FastifyReply) {
    const { authorization } = req.cookies as { authorization: string };
    const { token } = await client.oauth.verify(authorization);

    const profile = await client.oauth.getUser(token.access_token);

    if (!profile) {
        res.status(404).send({ error: 'User does not exist' });
    }

    res.send(profile);
}
