import type { FluorineClient } from '#classes';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function getGuilds(client: FluorineClient, req: FastifyRequest, res: FastifyReply) {
    const { authorization } = req.headers as { authorization: string };
    const { token } = await client.oauth.verify(authorization);
    let guilds = await client.oauth.getGuilds(token.access_token).catch(async () => {
        const refresh = await client.oauth
            .refreshToken(token.refresh_token)
            .catch(() => res.status(401).send({ error: 'Invalid token' }));
        guilds = await client.oauth.getGuilds(refresh.access_token);
        res.cookie('token', client.oauth.sign({ token: refresh, id: req.headers.id }));
    });
    if (!guilds) {
        return;
    }
    return {
        guilds: guilds.map(e => {
            const guild = client.guilds.cache.get(e.id);
            e.fluorine = Boolean(guild);
            return e;
        })
    };
}
