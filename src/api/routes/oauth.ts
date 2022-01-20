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
        res.header(
            'Set-Cookie',
            `token=${token.access_token}; SameSite=None; Secure; Max-Age=${token.expires_in}`
        );

        res.send('done!');
    });
}
