import { join } from 'node:path';
import process from 'node:process';

import { startServer } from '#api';
import { Logger } from '#classes';
import { CooldownHandler, EventHandler, InteractionHandler } from '#handlers';
import { CasesModule, EconomyModule, ShopModule, OAuthModule } from '#modules';
import { getDirname } from '#util';

import { PrismaClient } from '@prisma/client';
import { ActivityType, Client, Collection, disableValidators, GatewayIntentBits, Partials } from 'discord.js';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { performance } from 'perf_hooks';
import { bold, red } from 'yoctocolors';
import type { ChatInputCommand, ContextMenuCommand, ChatInputSubcommand, Component, Modal } from '#types';

export class FluorineClient extends Client {
    createdAt = performance.now();
    logger = Logger;
    i18n = i18next;
    prisma = new PrismaClient({});

    interactions = new InteractionHandler(this);

    chatInput = new Collection<string, ChatInputCommand | ChatInputSubcommand>();
    contextMenu = new Collection<string, ContextMenuCommand>();
    components = new Collection<string, Component>();
    modals = new Collection<string, Modal>();
    cooldowns = new CooldownHandler(this);

    economy = new EconomyModule(this);
    shop = new ShopModule(this);
    cases = new CasesModule(this);
    oauth = new OAuthModule(this);

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

        new EventHandler(this).loadEvents();

        this.interactions.loadCommands();

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
