import { Client, Collection, Intents } from 'discord.js';
import r from 'rethinkdb';
import { Logger } from './Logger';
import { Command } from 'types/command';
import { ApplicationCommands } from 'types/applicationCommand';
import { Component } from 'types/component';
import AI from './AI';
// @ts-ignore
import { version } from '../../package.json';
import { PhishingHandler } from './handlers/PhishingHandler';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';
import Loader from './Loader';
import { TagHandler } from './handlers/TagHandler';
export default class FluorineClient extends Client {
    applicationCommands!: ApplicationCommands;
    conn!: r.Connection;
    cmds!: Collection<string, Command>;
    components!: Collection<string, Component>;
    version: string;
    footer: string;
    logger: typeof Logger;
    generating: boolean;
    cooldown: Set<string>;
    ai: AI;
    i18n: typeof i18next;
    phishing: PhishingHandler;
    tags: TagHandler;
    config: any;
    modules: Record<string, any[]>;
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
        // @ts-ignore
        this.config = import('../../config.json');
        this.version = version;
        this.footer = `Fluorine ${this.version}`;
        this.logger = Logger;
        this.cooldown = new Set();
        this.i18n = i18next;
    }
    async init() {
        new Loader(this).load();
        this.ai = new AI(this);

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
