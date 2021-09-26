import { Client, ColorResolvable, Intents } from "discord.js";
import CommandHandler from "./handlers/CommandHandler";
import EventHandler from "./handlers/EventHandler";
import { functions } from "../util";
import r from "rethinkdb";
import Logger from "./Logger";
import { command } from "types/command.type";

export default class AlcanClient extends Client {
	conn: any;
	config: any;
	cmds!: Map<string, command>;
	version: string;
	footer: string;
	color: ColorResolvable;
	functions: any;
	logger: Logger;
	constructor() {
		super({
			intents: new Intents(
				Object.values(Intents.FLAGS).reduce((acc, p) => acc | p, 0)
			),
			allowedMentions: { repliedUser: false },
		});
		this.config = require(`${__dirname}/../../config.json`);
		r.connect(this.config.rethink).then((conn) => {
			this.conn = conn;
		});
		this.version = "1.0.0-beta";
		this.footer = `Alcan ${this.version}`;
		this.color = "#3872f2";
		this.functions = functions;
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
					r.table("config").insert({ id: g.id, prefix: "a!" }).run(this.conn);
				}
			});
			this.logger.log(
				`Loaded ${this.cmds.size} commands, checked ${this.guilds.cache.size} guilds`
			);
		});
		process.on("unhandledRejection", (error: Error) => {
			this.logger.error(error.stack!);
		});
	}
}
