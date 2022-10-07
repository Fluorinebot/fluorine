import type { FluorineClient } from '#classes';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function getAuth(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    const { code } = req.query as { code: string };
    if (!code) {
        reply.status(400).send({ error: 'Missing code' });
    }

    const token = await client.oauth.getToken(code);
    const user = await client.oauth.getUser(token.access_token);
    const jwt = client.oauth.sign({ token, id: user.id });

    reply.setCookie('token', jwt);
    reply.status(200).send();
}
