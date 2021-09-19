import AlcanClient from "@classes/Client";
import { Message, MessageEmbed } from "discord.js";
export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	const responses = [
		"Tak",
		"Nie",
		"Możliwe",
		"Prawdopodobnie",
		"Nie jestem pewien",
		"Wątpię",
	];
	if (!args[0]) {
		return message.reply("Musisz podać pytanie!");
	}
	let embed = new MessageEmbed()
		.setDescription(args.join(" "))
		.setFooter(client.footer)
		.setTimestamp()
		.addField(
			"Odpowiedź",
			responses[Math.floor(Math.random() * responses.length)]
		);
	message.reply({ embeds: [embed] });
}
export const help = {
	name: "fun",
	description: "Magiczna kula",
	aliases: [],
	category: "fun",
};
