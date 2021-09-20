import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message, MessageEmbed } from "discord.js";

export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	const embed = new Embed()
		.setTitle("Ping")
		.addField("Opóźnienie", `${client.ws.ping}ms`)
		.setFooter(client.footer);
	message.reply({ embeds: [embed] });
}
export const help = {
	name: "ping",
	description: "Opóźnienie pomiędzy discordem a botem",
	aliases: ["opoznienie", "pong"],
	category: "tools",
};
