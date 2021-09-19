import { readdirSync } from "fs";

export default class CommandHandler {
	map: Map<any, any>;
	constructor() {
		// import commands
		const dir = readdirSync(`${__dirname}/../../cmds`);
		this.map = new Map();
		dir.forEach(async (file) => {
			const name = file.split(".")[0];
			this.map.set(name, await import(`${__dirname}/../../cmds/${file}`));
		});
	}
}
