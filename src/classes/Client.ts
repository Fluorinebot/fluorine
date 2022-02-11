// @ts-ignore
import { version } from '../../package.json';

import { Client, Collection, ColorResolvable, Intents } from 'discord.js';
import r from 'rethinkdb';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';

import { ApplicationCommands } from 'types/applicationCommand';
import { Command } from 'types/command';
import { Component } from 'types/component';

import { Logger } from './Logger';
import EventHandler from '@handlers/EventHandler';
import ApplicationCommandHandler from '@handlers/ApplicationCommandHandler';
import CommandHandler from '@handlers/CommandHandler';
import ComponentHandler from '@handlers/ComponentHandler';
import EconomyHandler from '@handlers/EconomyHandler';
import ShopHandler from '@handlers/ShopHandler';
import TagHandler from './handlers/TagHandler';
import PhishingHandler from '@handlers/PhishingHandler';

export default class FluorineClient extends Client {
    applicationCommands!: ApplicationCommands;
    conn!: r.Connection;
    cmds!: Collection<string, Command>;
    components!: Collection<string, Component>;
    economy: EconomyHandler;
    phishing: PhishingHandler;
    shop: ShopHandler;
    tags: TagHandler;
    cooldown: Set<string>;
    invite: string;
    version: string;
    color: ColorResolvable;
    devs: string[];
    generating: boolean;
    logger: typeof Logger;
    i18n: typeof i18next;
    aiCooldown: Set<string>;
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
        r.connect({
            host: process.env.RETHINK_HOSTNAME,
            password: process.env.RETHINK_PASSWORD,
            db: process.env.RETHINK_DATABASE
        }).then(conn => {
            this.conn = conn;
        });
        this.version = version;
        this.invite =
            'https://discord.com/api/oauth2/authorize?client_id=831932409943425064&scope=bot+applications.commands&permissions=474527689975';
        this.color = '#3872f2';
        this.devs = ['707675871355600967', '478823932913516544', '348591272476540928'];
        this.logger = Logger;
        this.cooldown = new Set();
        this.i18n = i18next;
    }
    async init() {
        new EventHandler(this);
        this.cmds = new CommandHandler(this).loadCommands();

        const { loadChatInput, loadContextMenu } = new ApplicationCommandHandler(this);
        this.applicationCommands = {
            chatInput: loadChatInput(),
            contextMenu: loadContextMenu()
        };

        this.components = new ComponentHandler(this).loadComponents();
        this.phishing = new PhishingHandler(this);
        this.economy = new EconomyHandler(this);
        this.shop = new ShopHandler(this);
        this.tags = new TagHandler(this);
        this.aiCooldown = new Set();

        await this.i18n.use(Backend).init({
            fallbackLng: 'en-US',
            preload: ['en-US', 'pl'],
            backend: { loadPath: join(__dirname, '/../../i18n/{{lng}}.json') }
        });

        this.login().then(() => {
            this.guilds.cache.forEach(async g => {
                const guild = await r.table('config').get(g.id).run(this.conn);
                if (!guild) {
                    r.table('config')
                        .insert({
                            id: g.id,
                            prefix: process.env.DISCORD_PREFIX
                        })
                        .run(this.conn);
                }
            });

            this.logger.log(`Checked ${this.guilds.cache.size} guilds.`);
        });

        process.on('unhandledRejection', (error: Error) => {
            this.logger.error(error.stack);
        });
    }
}
