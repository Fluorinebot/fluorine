// @ts-ignore
import { version } from '../../package.json';
import { Client, Collection, ColorResolvable, Intents } from 'discord.js';
import r from 'rethinkdb';
import PhishingHandler from '@handlers/PhishingHandler';
import ApplicationCommandHandler from '@handlers/ApplicationCommandHandler';
import CommandHandler from '@handlers/CommandHandler';
import ComponentHandler from '@handlers/ComponentHandler';
import EventHandler from '@handlers/EventHandler';
import { Command } from 'types/command';
import { ApplicationCommands } from 'types/applicationCommand';
import { Component } from 'types/component';
import EconomyHandler from '@handlers/EconomyHandler';
import LanguageHandler from './handlers/LanguageHandler';
import ShopHandler from './handlers/ShopHandler';
import AI from './AI';
import Logger from './Logger';

export default class FluorineClient extends Client {
    applicationCommands!: ApplicationCommands;
    conn!: r.Connection;
    cmds!: Collection<string, Command>;
    components!: Collection<string, Component>;
    language: LanguageHandler;
    economy: EconomyHandler;
    phishing: PhishingHandler;
    cooldown: Set<string>;
    ai: AI;
    logger: Logger;
    invite: string;
    version: string;
    footer: string;
    color: ColorResolvable;
    devs: string[];
    generating: boolean;
    shop: ShopHandler;

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
        this.footer = `Fluorine ${this.version}`;
        this.color = '#3872f2';
        this.devs = [
            '707675871355600967',
            '478823932913516544',
            '348591272476540928'
        ];
        this.logger = new Logger();
        this.cooldown = new Set();
    }
    async init() {
        new EventHandler(this);
        this.language = new LanguageHandler();

        this.cmds = new CommandHandler().loadCommands();

        const { loadChatInput, loadContextMenu } =
            new ApplicationCommandHandler();
        this.applicationCommands = {
            chatInput: loadChatInput(),
            contextMenu: loadContextMenu()
        };

        this.components = new ComponentHandler().loadComponents();

        this.ai = new AI(this);
        this.phishing = new PhishingHandler(this);
        this.economy = new EconomyHandler(this);
        this.ai = new AI(this);
        this.shop = new ShopHandler(this);
        this.logger.log('Loaded events and commands');
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
            this.logger.log(
                `Loaded ${this.cmds.size} commands, checked ${this.guilds.cache.size} guilds`
            );
        });

        process.on('unhandledRejection', (error: Error) => {
            this.logger.error(error.stack);
        });
    }
}
