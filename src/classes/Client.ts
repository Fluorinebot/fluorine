import { Client, Intents } from 'discord.js';
import r from 'rethinkdb';
import { Client as Database } from 'pg';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';
import { bold, red } from 'picocolors';
import { performance } from 'perf_hooks';

import { Logger } from '@classes/Logger';
import EventHandler from '@handlers/EventHandler';
import ApplicationCommandHandler from '@handlers/ApplicationCommandHandler';
import CommandHandler from '@handlers/CommandHandler';
import ComponentHandler from '@handlers/ComponentHandler';
import AiModule from '@modules/AiModule';
import EconomyModule from '@modules/EconomyModule';
import ShopModule from '@modules/ShopModule';
import TagModule from '@modules/TagModule';
import PhishingModule from '@modules/PhishingModule';
import CasesModule from './modules/CasesModule';

export default class FluorineClient extends Client {
    createdAt = performance.now();
    logger = Logger;
    i18n = i18next;

    applicationCommands = new ApplicationCommandHandler(this);
    components = new ComponentHandler(this);
    cooldown = new Set<string>();
    cmds = new CommandHandler(this);

    economy = new EconomyModule(this);
    phishing = new PhishingModule(this);
    shop = new ShopModule(this);
    tags = new TagModule(this);
    ai = new AiModule(this);
    cases = new CasesModule(this);

    invite =
        'https://discord.com/api/oauth2/authorize?client_id=831932409943425064&scope=bot+applications.commands&permissions=474527689975';
    version = process.env.npm_package_version;
    devs = ['707675871355600967', '478823932913516544', '348591272476540928'];

    db = new Database();
    conn: r.Connection;

    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
            ],
            partials: ['MESSAGE'],
            allowedMentions: { repliedUser: false }
        });
    }

    async init() {
        this.logger.log(`Starting ${bold(red(process.env.NODE_ENV))} build...`);

        this.applicationCommands.loadChatInput();
        this.applicationCommands.loadContextMenu();
        this.components.loadComponents();

        // TODO: remove prefix commands a month after 2.0
        this.cmds.loadCommands();

        new EventHandler(this).loadEvents();

        await this.i18n.use(Backend).init({
            fallbackLng: 'en-US',
            preload: ['en-US', 'pl'],
            backend: { loadPath: join(__dirname, '/../../i18n/{{lng}}.json') }
        });

        await this.db.connect();

        this.conn = await r.connect({
            host: process.env.RETHINK_HOSTNAME,
            password: process.env.RETHINK_PASSWORD,
            db: process.env.RETHINK_DATABASE
        });

        this.login();

        process.on('unhandledRejection', (error: Error) => {
            this.logger.error(error.stack);
        });

        process.on('exit', async () => {
            await this.db.end();
        });
    }
}
