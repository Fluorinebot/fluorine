import BotConnection from '@dash/classes/BotConnection';
import OAuthHandler from '@dash/classes/OAuthHandler';
import r from 'rethinkdb';
import { Router } from 'express';

export default async function set(
    bot: BotConnection,
    oauth: OAuthHandler,
    router: Router
) {
    router.post('/guild/:guildId/set', async (req, res) => {
        if (!req.cookies.token) {
            return res.status(401).send('Unauthorized');
        }
        const user = await oauth.getUser(req.cookies.token);
        if (!user) {
            return res.status(401).send('Unauthorized');
        }
        if (isNaN(req.body.antibot)) {
            return res.send('Invalid antibot value');
        }
        if (!bot.checkPerms(user.id, req.params.guildId)) {
            return res.status(403).send('Forbidden');
        }
        const guild = bot.getGuild(req.params.guildId);
        if (!guild) {
            return res.status(404).send('Not Found');
        }
        const data = req.body;
        r.table('config')
            .get(req.params.guildId)
            .update(data)
            .run(bot.client.conn);
        res.status(200).send('OK');
    });
}
