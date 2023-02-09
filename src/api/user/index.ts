import type { FluorineClient } from '#classes';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function getOauthUser(client: FluorineClient, req: FastifyRequest, res: FastifyReply) {
    const { authorization } = req.cookies as { authorization: string };
    const { id } = await client.oauth.verify(authorization);

    const profile = await client.oauth.getUser(id);

    if (!profile) {
        res.status(404).send({ error: 'User does exist', userId: id.toString() });
    }

    res.send(profile);
}
