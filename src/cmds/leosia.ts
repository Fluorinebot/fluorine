import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message, MessageAttachment } from "discord.js";

export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	const file = new MessageAttachment("https://leosia.alcan.me").setName(
		"leosia.jpg"
	);
	const texts = ["young leosia", "jungle girl", "idolka"];
	message.reply({
		content: texts[Math.round(Math.random() * 3)],
		files: [file],
	});
}
export const help = {
	name: "leosia",
	description: "randomowe zdjecie young leosi",
	aliases: ["idolka"],
	category: "fun",
};
