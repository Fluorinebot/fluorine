import AlcanClient from "@classes/Client";
import { Message, MessageEmbed } from "discord.js";

export async function run(client: AlcanClient, message: Message) {
	const prefix = "a!";
	const args = message.content.slice(prefix.length).split(" ");
	const command = args.shift();
	if (message.content.startsWith("a!")) {
		const code = client.cmds.get(command);
		if (code) {
			code.run(client, message, args);
		} else {
			return message.react("❌");
		}
	} else if (message.content === `<@!${client.user!.id}>`) {
		const embed = new MessageEmbed()
			.setTitle("Alcan")
			.addField("Serwery", client.guilds.cache.size.toString())
			.addField("Użytkownicy", client.users.cache.size.toString())
			.addField("Komendy", client.cmds.size.toString())
			.addField("Kanały", client.channels.cache.size.toString())
			.setFooter("Alcan " + client.version);
		message.channel.send({ embeds: [embed] });
	}
}
