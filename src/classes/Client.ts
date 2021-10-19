import { Client, ColorResolvable, Intents } from "discord.js";
import CommandHandler from "./handlers/CommandHandler";
import EventHandler from "./handlers/EventHandler";
import r from "rethinkdb";
import Logger from "./Logger";
import { command } from "types/command.type";
import statsd from "hot-shots";
export default class AlcanClient extends Client {
	conn: any;
	config: any;
	cmds!: Map<string, command>;
	version: string;
	footer: string;
	color: ColorResolvable;
	logger: Logger;
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
		this.version = "1.7.0-beta";
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

			const stats = new statsd();
			stats.set("bot.guilds", 0);
			stats.set("bot.users", 0);

			setInterval(() => {
				stats.set("bot.guilds", this.guilds.cache.size);
				stats.set("bot.users", this.users.cache.size);
			}, 10000);
		});

		process.on("unhandledRejection", (error: Error) => {
			this.logger.error(error.stack!);
		});
	}
}
