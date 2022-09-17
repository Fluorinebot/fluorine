import type { FluorineClient } from '#classes';
import type { FastifyReply, FastifyRequest } from 'fastify';

function hasId(params: unknown): params is { id: string } {
    if (typeof params !== 'object' || !params) {
        return false;
    }
    return 'id' in params;
}

export async function handleGuild(client: FluorineClient, req: FastifyRequest, reply: FastifyReply) {
    if (!hasId(req.params)) {
        return reply.code(400).send();
    }

    return reply.send(`ur guild is ${req.params.id}`);
}
