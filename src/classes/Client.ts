import { Client, Collection, ColorResolvable, Intents } from 'discord.js';
import Statcord from 'statcord.js';
import r from 'rethinkdb';
import Logger from './Logger';
import ApplicationCommandHandler from '@handlers/ApplicationCommandHandler';
import CommandHandler from '@handlers/CommandHandler';
import ComponentHandler from '@handlers/ComponentHandler';
import EventHandler from '@handlers/EventHandler';
import { Command } from 'types/command';
import { ApplicationCommand } from 'types/applicationCommand';
import { Component } from 'types/component';
import { ConfigType } from 'types/config';
import LanguageHandler from './handlers/LanguageHandler';
// @ts-ignore
import { version } from '../../package.json';

export default class FluorineClient extends Client {
    applicationCommands!: Collection<string, ApplicationCommand>;
    conn!: r.Connection;
    config: ConfigType;
    cmds!: Collection<string, Command>;
    components!: Collection<string, Component>;
    invite: string;
    version: string;
    footer: string;
    color: ColorResolvable;
    logger: Logger;
    statcord!: Statcord.Client;
    generating: boolean;
    cooldown: Set<string>;
    language: LanguageHandler;
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
        this.invite =
            'https://discord.com/api/oauth2/authorize?client_id=831932409943425064&scope=bot+applications.commands&permissions=474527689975';
        this.footer = `Fluorine ${this.version}`;
        this.color = '#3872f2';
        this.logger = new Logger();
        this.generating = false;
        this.cooldown = new Set();
        this.language = new LanguageHandler();
    }
    async init() {
        new EventHandler(this);
        this.cmds = new CommandHandler().loadCommands();
        this.applicationCommands =
            new ApplicationCommandHandler().loadCommands();
        this.components = new ComponentHandler().loadComponents();
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
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const client = this;
            this.statcord = new Statcord.Client({
                client,
                key: client.config.statcord,
                postCpuStatistics: true,
                postMemStatistics: true,
                postNetworkStatistics: false
            });
        });

        process.on('unhandledRejection', (error: Error) => {
            this.logger.error(error.stack);
        });
    }
}
