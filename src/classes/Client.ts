import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import process from 'node:process';

import { startServer } from '#api';
import { Logger } from '#classes';
import { env } from '#env';
import { CooldownHandler, EventHandler, CommandHandler } from '#handlers';
import { CasesModule, EconomyModule, ShopModule, OAuthModule } from '#modules';
import type { ChatInputCommand, ContextMenuCommand, ChatInputSubcommand, Component, Modal } from '#types';
import { getDirname } from '#util';

import { PrismaClient } from '@prisma/client';
import { ActivityType, Client, Collection, disableValidators, GatewayIntentBits, Partials } from 'discord.js';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { bold, red } from 'yoctocolors';

export class FluorineClient extends Client {
    createdAt = performance.now();
    logger = Logger;

    i18n = i18next;
    prisma = new PrismaClient({});

    commands = new CommandHandler(this);

    chatInputCommands = new Collection<string, ChatInputCommand | ChatInputSubcommand>();
    contextMenuCommands = new Collection<string, ContextMenuCommand>();
    components = new Collection<string, Component>();
    modals = new Collection<string, Modal>();
    cooldowns = new CooldownHandler(this);

    economy = new EconomyModule(this);
    shop = new ShopModule(this);
    cases = new CasesModule(this);
    oauth = new OAuthModule(this);

    version = env.npm_package_version;
    devs = env.DISCORD_DEV_IDS;
    support = env.DISCORD_SUPPORT_INVITE;

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
        this.logger.log(`Starting ${bold(red(env.NODE_ENV ?? 'development'))} build...`);

        if (env.NODE_ENV === 'production') {
            disableValidators();
        }

        await this.i18n.use(Backend).init({
            fallbackLng: 'en-US',
            ns: ['responses', 'commands'],
            defaultNS: 'responses',
            preload: ['en-US', 'pl'],
            backend: { loadPath: join(getDirname(import.meta.url), '/../../i18n/{{lng}}/{{ns}}.json') }
        });

        // you have to call loaders after i18n otherwise builders could potentially fail.
        new EventHandler(this).loadEvents();
        this.commands.loadCommands();
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
