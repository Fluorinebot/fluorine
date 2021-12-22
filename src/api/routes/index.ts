import BotConnection from '@dash/classes/BotConnection';
import OAuthHandler from '@dash/classes/OAuthHandler';
import { Router } from 'express';
import me from './me';
import meGuilds from './meGuilds';
import oauth from './oauth';
import oauthReset from './oauthReset';
import guild from './guild';
import guildChannels from './guildChannels';
import set from './set';
export function createRouter(
    bot: BotConnection,
    oauth2: OAuthHandler,
    ratelimit: any
) {
    const router = Router();
    // @ts-ignore
    router.ratelimit = ratelimit;
    me(bot, oauth2, router);
    meGuilds(bot, oauth2, router);
    oauth(bot, oauth2, router);
    oauthReset(bot, oauth2, router);
    guild(bot, oauth2, router);
    guildChannels(bot, oauth2, router);
    set(bot, oauth2, router);
    return router;
}
