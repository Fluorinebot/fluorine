import BotConnection from '@dash/classes/BotConnection';
import OAuthHandler from '@dash/classes/OAuthHandler';
import { Router } from 'express';

export default async function me(
    bot: BotConnection,
    oauth: OAuthHandler,
    router: Router
) {
    router.get('/me', async (req, res) => {
        if (!req.cookies.token) {
            return res.status(401).send('Unauthorized');
        }
        const ip = req.headers['cf-connecting-ip'] || req.ip;
        // @ts-ignore
        router.ratelimit
            // @ts-ignore
            .consume(ip)
            .then(async () => {
                const user = await oauth.getUser(req.cookies.token);
                if (user.message) {
                    return res.status(401).send('Unauthorized');
                }
                res.send(user);
            })
            .catch(() => {
                res.status(429).send({ error: 'Too Many Requests' });
            });
    });
}
