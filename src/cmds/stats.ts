import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import("dayjs/locale/pl");

export async function run(client: AlcanClient, message: Message) {
	dayjs.extend(duration);
	dayjs.extend(relativeTime);
	dayjs.locale("pl");
	const uptime = dayjs.duration(client.uptime || 0).humanize();
	const embed = new Embed()
		.setTitle("Statystyki Alcana")
		.addField(
			"Użycie pamięci",
			`${(process.memoryUsage.rss() / 1000 / 1000).toFixed(1)} MB`
		)
		.addField("Ilość użytkowników", client.users.cache.size.toString())
		.addField("Ilość serwerów", client.guilds.cache.size.toString())
		.addField("Uptime", uptime);
	message.reply({ embeds: [embed] });
}
export const help = {
	name: "stats",
	description: "Statystyki bota",
	aliases: ["statystyki", "statistics"],
	category: "tools",
};
