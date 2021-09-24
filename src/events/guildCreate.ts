import AlcanClient from "@classes/Client";
import { Guild } from "discord.js";
import r from "rethinkdb";

export async function run(client: AlcanClient, guild: Guild) {
	r.table("config").insert({ prefix: "a!" }).run(client.conn);
}
