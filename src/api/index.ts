import type { FluorineClient } from '#classes';
import { env } from '#env';
import cors from '@fastify/cors';
import cookies from '@fastify/cookie';
import { fastify } from 'fastify';
import { blue, bold, green, magenta } from 'yoctocolors';
import { getGuild, patchGuild } from './guilds/[id]/index.js';
import { getGuilds } from './guilds/index.js';
import { getRoles } from './guilds/[id]/roles.js';
import { getAuth } from './auth/index.js';
import { tokenCheck } from './tokenCheck.js';
import { getChannels } from './guilds/[id]/channels.js';
import { getEconomy } from './guilds/[id]/economy/index.js';
import { getCases } from './guilds/[id]/cases/index.js';
import { deleteCase, getCase, patchCase } from './guilds/[id]/cases/[caseId].js';
import { patchEconomy } from './guilds/[id]/economy/[userId].js';
import { getProfile, patchProfile } from './profile.js';

const server = fastify({
    ignoreTrailingSlash: true
});

export async function startServer(client: FluorineClient) {
    await server.register(cors, {
        origin:
            env.NODE_ENV === 'production'
                ? ['https://fluorine.me', 'http://localhost:3000']
                : ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET', 'PATCH', 'DELETE'],
        credentials: true
    });

    await server.register(cookies);

    server.get('/guilds/:id(^\\d{17,19})', {
        handler: (req, reply) => getGuild(client, req, reply)
    });

    server.get('/guilds/:id(^\\d{17,19})/roles', {
        handler: (req, reply) => getRoles(client, req, reply)
    });

    server.get('/guilds/:id(^\\d{17,19})/channels', {
        handler: (req, reply) => getChannels(client, req, reply)
    });

    server.get('/guilds/:id(^\\d{17,19})/cases', {
        handler: (req, reply) => getCases(client, req, reply)
    });

    server.patch('/guilds/:id(^\\d{17,19})/cases/:case', {
        handler: (req, reply) => patchCase(client, req, reply)
    });

    server.get('/guilds/:id(^\\d{17,19})/cases/:case(^\\d+)', {
        handler: (req, reply) => getCase(client, req, reply)
    });

    server.delete('/guilds/:id(^\\d{17,19})/cases/:case', {
        handler: (req, reply) => deleteCase(client, req, reply)
    });

    server.get('/guilds/:id(^\\d{17,19})/economy', {
        handler: (req, reply) => getEconomy(client, req, reply)
    });

    server.patch('/guilds/:id(^\\d{17,19})/economy/:userId(^\\d{17,19})', {
        handler: (req, reply) => patchEconomy(client, req, reply)
    });

    server.get('/guilds', {
        handler: (req, reply) => getGuilds(client, req, reply)
    });

    server.get('/auth', {
        handler: (req, reply) => getAuth(client, req, reply)
    });

    server.patch('/guilds/:id(^\\d{17,19})', {
        handler: (req, reply) => patchGuild(client, req, reply)
    });

    server.get('/profile', {
        handler: (req, reply) => getProfile(client, req, reply)
    });

    server.patch('/profile', {
        handler: (req, reply) => patchProfile(client, req, reply)
    });

    server.addHook('preHandler', (req, reply) => tokenCheck(client, req, reply));

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
