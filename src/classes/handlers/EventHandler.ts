import AlcanClient from "@classes/Client";
import { readdir, readdirSync } from "fs";

export default class EventHandler {
	constructor(client: AlcanClient) {
		// import events
		const dir = readdirSync(`${__dirname}/../../events`);
		dir.forEach(async (event) => {
			const name = event.split(".")[0];
			const code: any = await import(`${__dirname}/../../events/${event}`);
			client.on(name, (event, event2) => {
				code.run(client, event, event2);
			});
		});
	}
}
