/* eslint-disable @typescript-eslint/no-unused-vars */
import BotConnection from '@dash/classes/BotConnection';
import r from 'rethinkdb';
import OAuthHandler from '@dash/classes/OAuthHandler';
import { Permissions } from 'discord.js';
import { Router } from 'express';

export default async function guild(
    bot: BotConnection,
    oauth: OAuthHandler,
    router: Router
) {
    router.get('/guild/:id', async (req, res) => {
        if (!req.cookies.token) {
            return res.status(401).send('Unauthorized');
        }
        const user = await oauth.getUser(req.cookies.token);
        if (!user.id) {
            return res.status(401).send('Unauthorized');
        }
        if (!bot.checkPerms(req.params.id, user.id)) {
            return res.status(401).send('Unauthorized');
        }
        const guild = bot.getGuild(req.params.id);
        const dbGuild = await r
            .table('config')
            .get(req.params.id)
            .run(bot.client.conn);
        if (!guild) {
            return res.status(404).send('Not found');
        }
        res.send(Object.assign(guild, dbGuild));
    });
}
