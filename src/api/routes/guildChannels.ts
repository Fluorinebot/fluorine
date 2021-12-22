/* eslint-disable @typescript-eslint/no-unused-vars */
import BotConnection from '@dash/classes/BotConnection';
import OAuthHandler from '@dash/classes/OAuthHandler';
import { Permissions } from 'discord.js';
import { Router } from 'express';

export default async function guildChannels(
    bot: BotConnection,
    oauth: OAuthHandler,
    router: Router
) {
    router.get('/guild/:id/channels', async (req, res) => {
        if (!req.cookies.token) {
            return res.status(401).send('Unauthorized');
        }
        const user = await oauth.getUser(req.cookies.token);
        if (!user) {
            return res.status(401).send('Unauthorized');
        }
        if (!bot.checkPerms(user.id, req.params.id)) {
            return res.status(403).send('Forbidden');
        }
        const channels = bot.getChannels(req.params.id);
        if (!channels) {
            return res.status(404).send('Not Found');
        }
        res.send(channels);
    });
}
