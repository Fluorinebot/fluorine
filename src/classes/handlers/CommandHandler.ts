import { readdirSync } from "fs";

export default class CommandHandler {
	map: Map<any, any>;
	constructor() {
		// import commands
		this.map = new Map();
	}
	loadCommands() {
		const dir = readdirSync(`${__dirname}/../../cmds`);
		dir.forEach(async (file) => {
			const name = file.split(".")[0];
			this.map.set(name, await import(`${__dirname}/../../cmds/${file}`));
		});
		return this.map;
	}
}
