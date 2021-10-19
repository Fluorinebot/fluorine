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
		return message.reply({ embeds: [permEmbed] });
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
				if (args[2] !== "y" && args[2] !== "n") {
					return message.reply("Wartość tej opcji powinna być y, lub n.");
				}

				const bool = args[2] === "y";
				r.table("config")
					.get(message.guild!.id)
					.update({ logs: bool })
					.run(client.conn);

				const logEmbed = new Embed()
					.setTitle("Status logów ustawiony!")
					.addField("Nowy status", bool ? "Włączone" : "Wyłączone")
					.setFooter(client.footer);

				message.reply({ embeds: [logEmbed] });
				break;
			case "logsChannel":
				const channel = message.mentions.channels.first()?.id || args[2];
				if (!message.guild?.channels.cache.get(channel)) {
					return message.reply(
						"Nieprawidłowy kanał! Oznacz kanał lub podaj jego id."
					);
				}
				r.table("config")
					.get(message.guild!.id)
					.update({ logsChannel: channel })
					.run(client.conn);

				const channelEmbed = new Embed()
					.setTitle("Kanał logów ustawiony!")
					.addField("Nowy kanał", `<#${channel}>`)
					.setFooter(client.footer);

				message.reply({ embeds: [channelEmbed] });

				break;
			case "modlog":
				if (args[2] !== "y" && args[2] !== "n") {
					return message.reply("Wartość tej opcji powinna być y, lub n.");
				}
				const modBool = args[2] === "y";
				r.table("config")
					.get(message.guild!.id)
					.update({ modLogs: modBool })
					.run(client.conn);

				const modEmbed = new Embed()
					.setTitle("Status modlogów ustawiony!")
					.addField("Nowy status", modBool ? "Włączone" : "Wyłączone")
					.setFooter(client.footer);

				message.reply({ embeds: [modEmbed] });
				break;
		}
	} else {
		const settings: any = await r
			.table("config")
			.get(message.guild!.id)
			.run(client.conn);
		const listEmbed = new Embed()
			.setTitle("Konfiguracja")
			.setDescription(
				"Lista wszystkich opcji do konfiguracji\nUżyj config set <opcja> <wartość> aby ustawić!"
			)
			.addField("prefix", settings.prefix)
			.addField("logs", settings.logs ? "Włączone" : "Wyłączone")

			.addField("modlog", settings.modLogs ? "Włączone" : "Wyłączone")
			.setFooter(client.footer);
		if (settings.logsChannel) {
			listEmbed.addField("logsChannel", `<#${settings.logsChannel}>`);
		} else {
			listEmbed.addField("logsChannel", "Nie ustawiono");
		}
		message.reply({ embeds: [listEmbed] });
	}
}
export const help = {
	name: "config",
	description: "Konfiguruj bota",
	aliases: ["konfiguracja"],
	category: "tools",
};
