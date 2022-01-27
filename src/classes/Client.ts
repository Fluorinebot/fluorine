// @ts-ignore
import { version } from '../../package.json';
import { Client, Collection, ColorResolvable, Intents } from 'discord.js';
import r from 'rethinkdb';

import { Command } from 'types/command';
import { ConfigType } from 'types/config';
import { Component } from 'types/component';
import { ApplicationCommand } from 'types/applicationCommand';

import ApplicationCommandHandler from '@handlers/ApplicationCommandHandler';
import CommandHandler from '@handlers/CommandHandler';
import ComponentHandler from '@handlers/ComponentHandler';
import EventHandler from '@handlers/EventHandler';
import LanguageHandler from '@handlers/LanguageHandler';
import PhishingHandler from '@handlers/PhishingHandler';
import EconomyHandler from '@handlers/EconomyHandler';

import AI from './AI';
import Logger from './Logger';

export default class FluorineClient extends Client {
    applicationCommands!: Collection<string, ApplicationCommand>;
    cmds!: Collection<string, Command>;
    components!: Collection<string, Component>;
    language: LanguageHandler;
    economy: EconomyHandler;
    phishing: PhishingHandler;
    conn!: r.Connection;
    config: ConfigType;
    cooldown: Set<string>;
    ai: AI;
    logger: Logger;
    invite: string;
    version: string;
    footer: string;
    color: ColorResolvable;
    devs: string[];
    generating: boolean;

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
        this.version = version;
        this.invite =
            'https://discord.com/api/oauth2/authorize?client_id=831932409943425064&scope=bot+applications.commands&permissions=474527689975';
        this.footer = `Fluorine ${this.version}`;
        this.color = '#3872f2';
        this.devs = ['707675871355600967', '478823932913516544'];

        this.logger = new Logger();
        this.cooldown = new Set();
    }
    async init() {
        new EventHandler(this);
        r.connect(this.config.rethink).then(conn => {
            this.conn = conn;
        });
        this.language = new LanguageHandler();

        this.cmds = new CommandHandler().loadCommands();
        this.applicationCommands =
            new ApplicationCommandHandler().loadCommands();
        this.components = new ComponentHandler().loadComponents();

        this.ai = new AI(this);
        this.phishing = new PhishingHandler(this);
        this.economy = new EconomyHandler(this);

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
