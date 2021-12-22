import BotConnection from '@dash/classes/BotConnection';
import OAuthHandler from '@dash/classes/OAuthHandler';
import { Router } from 'express';

export default async function oauthReset(
    bot: BotConnection,
    oauth: OAuthHandler,
    router: Router
) {
    router.get('/oauth/reset', async (req, res) => {
        if (!req.cookies.refresh_token) {
            return res.send('Unauthorized');
        }
        // @ts-ignore
        const token = await oauth.refreshToken(req.cookies.refresh_token);
        res.cookie('token', token.access_token, {
            maxAge: Date.now() + token.expires_in * 1000,
            domain: `.${bot.client.config.domain}`
        });
        res.cookie('refresh_token', token.refresh_token, {
            maxAge: Date.now() + token.expires_in * 1000,
            domain: `.${bot.client.config.domain}`
        });
        res.send('done!');
    });
}
