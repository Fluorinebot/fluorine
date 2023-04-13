import type { FluorineClient } from '#classes';
import type { Replace } from '#types';
import type { Profile } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function getProfile(client: FluorineClient, req: FastifyRequest, res: FastifyReply) {
    const { authorization } = req.cookies as { authorization: string };
    const { id } = await client.oauth.verify(authorization);

    const profile = await client.prisma.profile.findUnique({ where: { userId: BigInt(id) } });

    if (!profile) {
        res.status(404).send({ error: 'User does not have a profile', userId: id.toString() });
    }

    const proccessed: Replace<Profile, 'userId', string | bigint> = { ...profile };
    proccessed.userId = profile.userId.toString();

    res.send(proccessed);
}

export async function patchProfile(client: FluorineClient, req: FastifyRequest, res: FastifyReply) {
    const { authorization } = req.cookies as { authorization: string };
    const { id } = await client.oauth.verify(authorization);

    const body = (req.body ? JSON.parse(req.body as string) : {}) as Partial<Profile>;
    body.userId = BigInt(body.userId);

    console.log(id);

    await client.prisma.profile.upsert({
        where: { userId: BigInt(id) },
        create: { ...body, userId: BigInt(id) },
        update: {
            userId: undefined,
            ...body
        }
    });

    res.status(204).send();
}
