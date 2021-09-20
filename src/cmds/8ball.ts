import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";
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
		const errorEmbed = new Embed()
			.setTitle("Błąd")
			.setDescription("Musisz podać pytanie!")
			.setFooter(client.footer)
			.setColor(client.color);
		return message.reply({ embeds: [errorEmbed] });
	}
	const embed = new Embed()
		.setDescription(args.join(" "))
		.setFooter(client.footer)
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
