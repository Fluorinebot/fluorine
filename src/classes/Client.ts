import { Client, ColorResolvable, Intents } from "discord.js";
import { connect } from "rethinkdb";
import CommandHandler from "./handlers/CommandHandler";
import EventHandler from "./handlers/EventHandler";
import { functions } from "../util";
import Logger from "./Logger";
export default class AlcanClient extends Client {
	conn: any;
	config: any;
	cmds!: Map<any, any>;
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
		connect({}).then((conn) => {
			this.conn = conn;
		});
		this.config = require(`${__dirname}/../../config.json`);
		this.version = "1.0.0-beta";
		this.footer = `Alcan ${this.version}`;
		this.color = "#3872f2";
		this.functions = functions;
		this.logger = new Logger();
	}
	init() {
		new EventHandler(this);
		this.cmds = new CommandHandler().map;
		this.login(this.config.token);
		process.on("unhandledRejection", (error) => {
			this.logger.error(error!.toString());
		});
	}
}
