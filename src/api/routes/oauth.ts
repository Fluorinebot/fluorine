import BotConnection from '@dash/classes/BotConnection';
import OAuthHandler from '@dash/classes/OAuthHandler';
import { Router } from 'express';

export default async function oauth(
    bot: BotConnection,
    oauth: OAuthHandler,
    router: Router
) {
    router.get('/oauth', async (req, res) => {
        if (!req.query.code) {
            return res.redirect(
                `https://discord.com/api/oauth2/authorize?client_id=${bot.client.user.id}&redirect_uri=${bot.client.config.redirect_uri}&response_type=code&scope=identify%20guilds`
            );
        }
        // @ts-ignore
        const token = await oauth.getToken(req.query.code);
        if (!token.access_token) {
            return res
                .status(400)
                .send(
                    'There was an error! Maybe your discord code is malformed? Try again.'
                );
        }
        res.cookie('token', token.access_token, {
            maxAge: Date.now() + token.expires_in * 1000
        });
        res.cookie('refresh_token', token.refresh_token, {
            maxAge: Date.now() + token.expires_in * 1000
        });

        res.send('done!');
    });
}
