import BotConnection from '@dash/classes/BotConnection';
import OAuthHandler from '@dash/classes/OAuthHandler';
import { Permissions } from 'discord.js';
import { Router } from 'express';

export default async function meGuilds(
    bot: BotConnection,
    oauth: OAuthHandler,
    router: Router
) {
    router.get('/me/guilds', async (req, res) => {
        console.log(req.cookies);
        if (!req.cookies.token) {
            return res.status(400).send({ error: 'You need to get a token' });
        }

        const ip = req.headers['cf-connecting-ip'] || req.ip;
        // @ts-ignore
        router.ratelimit
            // @ts-ignore
            .consume(ip)
            .then(async () => {
                const guilds = await oauth.getGuilds(req.cookies.token);
                if (guilds.message) {
                    return res.status(400).send('There has been an error!');
                }
                const resGuilds = [];
                guilds.forEach(g => {
                    const perms = new Permissions(g.permissions_new);
                    if (perms.has('MANAGE_GUILD') && bot.getGuild(g.id)) {
                        return resGuilds.push(g);
                    }
                });
                res.send(resGuilds);
            })
            .catch(() => res.status(429).send({ error: 'Too Many Requests' }));
    });
}
