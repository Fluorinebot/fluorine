import FluorineClient from '@classes/Client';
import express from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import BotConnection from './classes/BotConnection';
import OAuthHandler from './classes/OAuthHandler';
import cookieParser from 'cookie-parser';
import { createRouter } from './routes';
export default class Dashboard {
    app: express.Application;
    bot: BotConnection;
    oauth: OAuthHandler;
    router: any;
    ratelimit: RateLimiterMemory;
    constructor(client: FluorineClient) {
        this.app = express();
        this.ratelimit = new RateLimiterMemory({ points: 1, duration: 1 });
        this.bot = new BotConnection(client);
        this.oauth = new OAuthHandler(client, ['identify', 'guilds']);
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.router = createRouter(this.bot, this.oauth, this.ratelimit);
        this.app.use((req, res, next) => {
            res.setHeader(
                'Access-Control-Allow-Origin',
                this.bot.client.config.cors
            );
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Headers', 'content-type');
            next();
        });
        this.app.use('/', this.router);
    }
    listen(port: number) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.app.use((err, req, res, next) => {
            res.status(500).send(
                'Something got broken! You probably provided invalid body json.'
            );
        });
        this.app.listen(port);
    }
}
