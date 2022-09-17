import process from 'node:process';
import type { FluorineClient } from '#classes';

import cors from '@fastify/cors';
import { fastify } from 'fastify';
import { blue, bold, green, magenta } from 'yoctocolors';
import { handleGuild } from './guilds/[id]';
import { handleGuilds } from './guilds';

const server = fastify({
    ignoreTrailingSlash: true
});

export async function startServer(client: FluorineClient) {
    await server.register(cors, {
        origin: process.env.NODE_ENV === 'production' ? ['https://fluorine.me', 'http://localhost:3000'] : '*',
        methods: ['GET']
    });

    server.get('/guilds/:id(^\\d{17,19})', (req, reply) => handleGuild(client, req, reply));

    server.get('/guilds', {
        handler: (req, reply) => handleGuilds(client, req, reply)
    });

    server.addHook('onRequest', async (req, reply) => {
        if (!['DELETE', 'GET', 'PATCH'].includes(req.method)) {
            reply.callNotFound();
        }
    });

    const validRoutes = ['/', '/favicon.ico'];
    server.addHook('onResponse', async (req, reply) => {
        const ip = reply.statusCode >= 299 && !validRoutes.includes(req.url) ? req.ip : '';
        client.logger.log(green(`${bold(req.method)} ${req.url}`), magenta(bold(reply.statusCode.toString())), ip);
    });

    server.addHook('onError', async (req, reply, error) => {
        client.logger.error(bold(req.method), req.url, error.stack);
    });

    try {
        await server.listen({ port: 8080, host: '0.0.0.0' });
        client.logger.log(`Server listening at ${blue('http://127.0.0.1:8080')}`);
    } catch (error) {
        client.logger.error(error);
    }
}
