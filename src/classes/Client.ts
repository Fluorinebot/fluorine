import { Client } from 'tiscord';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { ActivityType, PresenceUpdateStatus } from 'discord-api-types/v10';
import { Logger } from '#classes/Logger';
import { join } from 'path';
import { bold, red } from 'picocolors';
import { performance } from 'perf_hooks';

import { PrismaClient } from '@prisma/client';

import EventHandler from '#handlers/EventHandler';
import CommandHandler from '#classes/handlers/CommandHandler';
import ComponentHandler from '#handlers/ComponentHandler';
import CooldownHandler from '#handlers/CooldownHandler';

import AIModule from '#modules/AIModule';
import EconomyModule from '#modules/EconomyModule';
import ShopModule from '#modules/ShopModule';
import CasesModule from '#modules/CasesModule';

export default class FluorineClient extends Client {
    createdAt = performance.now();
    logger = Logger;
    i18n = i18next;
    prisma = new PrismaClient();

    commands = new CommandHandler(this);
    components = new ComponentHandler(this);
    cooldowns = new CooldownHandler(this);

    economy = new EconomyModule(this);
    shop = new ShopModule(this);
    ai = new AIModule(this);
    cases = new CasesModule(this);

    version = process.env.npm_package_version;
    devs = ['707675871355600967', '478823932913516544', '348591272476540928'];
    support = process.env.DISCORD_SUPPORT_INVITE;

    constructor() {
        super({
            intents: ['Guilds', 'GuildMessages', 'MessageContent'],
            allowedMentions: { replied_user: false },
            presence: {
                afk: false,
                since: null,
                status: PresenceUpdateStatus.Online,
                activities: [{ name: 'with dangerous chemicals | /help', type: ActivityType.Playing }]
            },
            token: process.env.DISCORD_TOKEN
        });
    }

    async init() {
        this.logger.log(`Starting ${bold(red(process.env.NODE_ENV))} build...`);

        this.commands.loadChatInput();
        this.commands.loadContextMenu();

        this.components.loadComponents();
        new EventHandler(this).loadEvents();

        await this.i18n.use(Backend).init({
            fallbackLng: 'en-US',
            preload: ['en-US', 'pl'],
            backend: { loadPath: join(__dirname, '/../../i18n/{{lng}}.json') }
        });

        await this.prisma.$connect();
        this.login();

        process.on('unhandledRejection', (error: Error) => {
            this.logger.error(error.stack);
        });

        process.on('exit', async () => {
            await this.prisma.$disconnect();
        });
    }
}
