import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
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
			const funEmbed = new Embed()
				.setTitle("4Fun")
				.setDescription(list.fun)
				.setFooter(client.footer);
			message.reply({ embeds: [funEmbed] });
			break;
		case "tools":
			const toolEmbed = new Embed()
				.setTitle("Narzędzia")
				.setDescription(list.tools)
				.setFooter(client.footer);
			message.reply({ embeds: [toolEmbed] });
			break;
		case "moderation":
			const modEmbed = new Embed()
				.setTitle("Moderacja")
				.setDescription(list.moderation)
				.setFooter(client.footer);

			message.reply({ embeds: [modEmbed] });
			break;
		case "dev":
			break;
		default:
			const defaultEmbed = new Embed()
				.setTitle("Pomoc")
				.setDescription("Kategorie")
				.addField("4Fun", "a!help fun")
				.addField("Narzędzia", "a!help tools")
				.addField("Moderacja", "a!help moderation")
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
