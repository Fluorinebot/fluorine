import AlcanClient from "@classes/Client";
import { Message, MessageEmbed } from "discord.js";

export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	const cmds = Array.from(client.cmds.values());
	const list: any = {};
	["fun", "tools", "moderation", "dev"].forEach((key) => {
		list[key] =
			cmds
				.filter((cmd) => cmd.help.category === key)
				.map((c) => c.help.name)
				.join(` \n `) || "None";
	});
	switch (args[0]) {
		case "fun":
			const funEmbed = new MessageEmbed()
				.setTitle("4Fun")
				.setDescription(list.fun)
				.setFooter(client.footer)
				.setTimestamp();
			message.reply({ embeds: [funEmbed] });
			break;
		case "tools":
			const toolEmbed = new MessageEmbed()
				.setTitle("Narzędzia")
				.setDescription(list.tools)
				.setFooter(client.footer)
				.setTimestamp();
			message.reply({ embeds: [toolEmbed] });
			break;
		case "moderation":
			const modEmbed = new MessageEmbed()
				.setTitle("Moderacja")
				.setDescription(list.moderation)
				.setFooter(client.footer)
				.setTimestamp();
			message.reply({ embeds: [modEmbed] });
			break;
		case "dev":
			break;
		default:
			const defaultEmbed = new MessageEmbed()
				.setTitle("Pomoc")
				.setDescription("Kategorie")
				.addField("4Fun", "a!help fun")
				.addField("Narzędzia", "a!help tools")
				.addField("Moderacja", "a!help moderation")
				.setTimestamp()
				.setFooter(client.footer);
			message.channel.send({ embeds: [defaultEmbed] });
			break;
	}
}
export const help = {
	name: "help",
	description: "Lista komend",
	aliases: ["pomoc", "h"],
	category: "tools",
};
