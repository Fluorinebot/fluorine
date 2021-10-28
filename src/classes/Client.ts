import { Client, ColorResolvable, Intents } from "discord.js";
import Statcord from "statcord.js";
import r from "rethinkdb";
import Logger from "./Logger";
import CommandHandler from "@handlers/CommandHandler";
import EventHandler from "@handlers/EventHandler";
import { command } from "types/command.type";
import { ConfigType } from "types/config.type";

export default class AlcanClient extends Client {
	conn!: r.Connection;
	config: ConfigType;
	cmds!: Map<string, command>;
	version: string;
	footer: string;
	color: ColorResolvable;
	logger: Logger;
	statcord!: Statcord.Client;
	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_BANS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_PRESENCES,
				Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
			],
			allowedMentions: { repliedUser: false },
		});
		this.config = require(`${__dirname}/../../config.json`);
		r.connect(this.config.rethink).then((conn) => {
			this.conn = conn;
		});
		this.version = "1.0.0";
		this.footer = `Alcan ${this.version}`;
		this.color = "#3872f2";
		this.logger = new Logger();
	}
	async init() {
		new EventHandler(this);
		this.cmds = new CommandHandler().loadCommands();
		this.logger.log("loaded events and commands");
		this.login(this.config.token).then(() => {
			this.guilds.cache.forEach(async (g) => {
				const guild = await r.table("config").get(g.id).run(this.conn);
				if (!guild) {
					r.table("config")
						.insert({ id: g.id, prefix: this.config.prefix })
						.run(this.conn);
				}
			});
			this.logger.log(
				`Loaded ${this.cmds.size} commands, checked ${this.guilds.cache.size} guilds`
			);
			const client = this;
			this.statcord = new Statcord.Client({
				client,
				key: client.config.statcord,
				postCpuStatistics:
					true /* Whether to post memory statistics or not, defaults to true */,
				postMemStatistics:
					true /* Whether to post memory statistics or not, defaults to true */,
				postNetworkStatistics:
					false /* Whether to post memory statistics or not, defaults to true */,
			});
		});

		process.on("unhandledRejection", (error: Error) => {
			this.logger.error(error.stack!);
		});
	}
}
