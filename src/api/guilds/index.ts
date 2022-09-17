import type { FluorineClient } from '#classes';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function handleGuilds(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    return reply.send('ur guilds are 4');
}
