import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";
import r from "rethinkdb";

export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	if (!message.member?.permissions.has("ADMINISTRATOR")) {
		const permEmbed = new Embed()
			.setTitle("Błąd!")
			.setDescription(
				"Nie posiadasz permisji do wykonania tego!\nWymagane permisje: Administrator"
			)
			.setFooter(client.footer);
		message.reply({ embeds: [permEmbed] });
	}
	if (args[0] === "set") {
		switch (args[1]) {
			case "prefix":
				if (!args[2]) return message.reply("Musisz podać prefix!");
				if (args[2].length > 20) {
					return message.reply("Prefix powinien mieć poniżej 10 znaków");
				}

				r.table("config")
					.get(message.guild!.id)
					.update({ prefix: args[2] })
					.run(client.conn);
				const prefixEmbed = new Embed()
					.setTitle("Prefix ustawiony!")
					.addField("Nowy prefix", args[2])
					.setFooter(client.footer);

				message.reply({ embeds: [prefixEmbed] });
				break;
			case "logs":
				break;
			case "logChannel":
				break;
		}
	} else {
		const listEmbed = new Embed()
			.setTitle("Konfiguracja")
			.setDescription("Lista wszystkich opcji do konfiguracji")
			.addField("Prefix", "a!config set prefix <prefix>")
			.addField("Logi", "a!config set logs <y/n>")
			.addField("Kanał logów", "a!config set logChannel <kanal>")
			.setFooter(client.footer);

		message.reply({ embeds: [listEmbed] });
	}
}
export const help = {
	name: "config",
	description: "Konfiguruj bota",
	aliases: ["konfiguracja"],
	category: "tools",
};
