import { join } from 'node:path';
import process from 'node:process';

import { startServer } from '#api';
import { Logger } from '#classes';
import { CommandHandler, ComponentHandler, CooldownHandler, EventHandler } from '#handlers';
import { AIModule, CasesModule, EconomyModule, OauthModule, PhishingModule, ShopModule } from '#modules';
import { getDirname } from '#util';

import { PrismaClient } from '@prisma/client';
import { ActivityType, Client, disableValidators, GatewayIntentBits, Partials } from 'discord.js';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { performance } from 'perf_hooks';
import { bold, red } from 'yoctocolors';

export class FluorineClient extends Client {
    createdAt = performance.now();
    logger = Logger;
    i18n = i18next;
    prisma = new PrismaClient();

    commands = new CommandHandler(this);
    components = new ComponentHandler(this);
    cooldowns = new CooldownHandler(this);

    economy = new EconomyModule(this);
    phishing = new PhishingModule(this);
    shop = new ShopModule(this);
    ai = new AIModule(this);
    cases = new CasesModule(this);
    oauth = new OauthModule(this);

    version = process.env.npm_package_version;
    devs = ['707675871355600967', '478823932913516544', '348591272476540928'];
    support = process.env.DISCORD_SUPPORT_INVITE;

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
            partials: [Partials.Message],
            allowedMentions: { repliedUser: false },
            presence: {
                activities: [{ name: 'with dangerous chemicals | /help', type: ActivityType.Playing }]
            }
        });
    }

    async init() {
        this.logger.log(`Starting ${bold(red(process.env.NODE_ENV ?? 'development'))} build...`);

        if (process.env.NODE_ENV === 'production') {
            disableValidators();
        }

        this.commands.loadChatInput();
        this.commands.loadContextMenu();

        this.components.loadComponents();
        new EventHandler(this).loadEvents();

        await this.i18n.use(Backend).init({
            fallbackLng: 'en-US',
            preload: ['en-US', 'pl'],
            backend: { loadPath: join(getDirname(import.meta.url), '/../../i18n/{{lng}}.json') }
        });

        await this.prisma.$connect();
        this.login();

        await startServer(this);

        process.on('unhandledRejection', (error: Error) => {
            this.logger.error(error.stack);
        });

        process.on('exit', async () => {
            await this.prisma.$disconnect();
        });
    }
}
