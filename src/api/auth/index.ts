import type { FluorineClient } from '#classes';
import type { APIUser, RESTPostOAuth2ClientCredentialsResult } from 'discord.js';
import { createSigner } from 'fast-jwt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import process from 'node:process';
export async function handleAuth(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    const { code } = req.query as { code: string };
    if (!code) {
        reply.status(400).send({ error: 'Missing code' });
    }
    const token = (await client.oauth.getToken(code)) as RESTPostOAuth2ClientCredentialsResult;
    const user = (await client.oauth.getUser(token.access_token)) as APIUser;
    const signer = createSigner({ key: process.env.JWT_SECRET });
    const jwt = signer({ token, id: user.id });
    reply.setCookie('token', jwt, { expires: new Date(Date.now() + token.expires_in * 1000) });
    reply.status(200);
}
