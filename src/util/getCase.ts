import { Guild } from "discord.js";
import r from "rethinkdb";
import AlcanClient from "@classes/Client";
export default async function caseGet(
	client: AlcanClient,
	guild: Guild,
	nr: Number
) {
	return (
		r
			.table("case")
			// @ts-ignore
			.getAll([guild.id, nr], { index: "case" })
			.coerceTo("array")
			.run(client.conn)
	);
}
