import { Client, ColorResolvable, Intents } from 'discord.js';
import Statcord from 'statcord.js';
import r from 'rethinkdb';
import Logger from './Logger';
import CommandHandler from '@handlers/CommandHandler';
import EventHandler from '@handlers/EventHandler';
import { command } from 'types/command.type';
import { ConfigType } from 'types/config.type';
import LanguageHandler from './handlers/LanguageHandler';
// @ts-ignore
import { version } from '../../package.json';
import PhishingHandler from './handlers/PhishingHandler';

export default class FluorineClient extends Client {
    conn!: r.Connection;
    config: ConfigType;
    cmds!: Map<string, command>;
    version: string;
    footer: string;
    color: ColorResolvable;
    logger: Logger;
    cooldown: Set<string>;
    language: LanguageHandler;
    phishing: PhishingHandler;
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
        this.config = require(`${__dirname}/../../config.json`);
        r.connect(this.config.rethink).then(conn => {
            this.conn = conn;
        });
        this.version = version;
        this.footer = `Fluorine ${this.version}`;
        this.color = '#3872f2';
        this.logger = new Logger();
        this.cooldown = new Set();
        this.language = new LanguageHandler();
    }
    async init() {
        new EventHandler(this);
        this.cmds = new CommandHandler().loadCommands();
        this.phishing = new PhishingHandler(this);
        this.logger.log('loaded events and commands');
        this.login(this.config.token).then(() => {
            this.guilds.cache.forEach(async g => {
                const guild = await r.table('config').get(g.id).run(this.conn);
                if (!guild) {
                    r.table('config')
                        .insert({ id: g.id, prefix: this.config.prefix })
                        .run(this.conn);
                }
            });
            this.logger.log(
                `Loaded ${this.cmds.size} commands, checked ${this.guilds.cache.size} guilds`
            );
        });

        process.on('unhandledRejection', (error: Error) => {
            this.logger.error(error.stack);
        });
    }
}
