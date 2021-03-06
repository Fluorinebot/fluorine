import { ActivityType, Client, disableValidators, GatewayIntentBits, Partials } from 'discord.js';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { REST } from '@discordjs/rest';

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
import PhishingModule from '#modules/PhishingModule';
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
    phishing = new PhishingModule(this);
    shop = new ShopModule(this);
    ai = new AIModule(this);
    cases = new CasesModule(this);

    version = process.env.npm_package_version;
    devs = ['707675871355600967', '478823932913516544', '348591272476540928'];
    support = process.env.DISCORD_SUPPORT_INVITE;

    restModule = new REST({ version: '10' });

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
        this.logger.log(`Starting ${bold(red(process.env.NODE_ENV))} build...`);

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
            backend: { loadPath: join(__dirname, '/../../i18n/{{lng}}.json') }
        });

        await this.prisma.$connect();
        this.restModule.setToken(process.env.DISCORD_TOKEN);
        this.login();

        process.on('unhandledRejection', (error: Error) => {
            this.logger.error(error.stack);
        });

        process.on('exit', async () => {
            await this.prisma.$disconnect();
        });
    }
}
