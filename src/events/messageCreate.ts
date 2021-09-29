import AlcanClient from "@classes/Client";
import { Message, MessageEmbed } from "discord.js";
import r from "rethinkdb";

export async function run(client: AlcanClient, message: Message) {
	if (message.channel.type === "DM") {
		return message.reply(
			"Cześć! Komendy nie działają na prywatnych wiadomościach, spróbuj napisać `a!help` na serwerze na którym jestem!"
		);
	}
	const settings: any = await r
		.table("config")
		.get(message.guild!.id)
		.run(client.conn);
	const args = message.content.slice(settings.prefix.length).split(" ");
	const command = args.shift();

	if (message.content.startsWith(settings.prefix)) {
		const code = client.cmds.get(command!);
		if (code) {
			code.run(client, message, args);
		} else {
			return message.react("❌");
		}
	} else if (message.content === `<@!${client.user!.id}>`) {
		const embed = new MessageEmbed()
			.setTitle("Alcan")
			.setDescription("Mój prefix na tym serwerze to" + settings!.prefix)
			.addField("Serwery", client.guilds.cache.size.toString())
			.addField("Użytkownicy", client.users.cache.size.toString())
			.addField("Komendy", client.cmds.size.toString())
			.addField("Kanały", client.channels.cache.size.toString())
			.setFooter("Alcan " + client.version);
		message.channel.send({ embeds: [embed] });
	}
}
