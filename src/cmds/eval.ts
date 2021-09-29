import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";

export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	if (message.author.id !== "707675871355600967") {
		return message.reply("ta komenda jest dostepna tylko dla developerow");
	}
	if (args.includes("client.token")) return message.reply("usun client.token ");

	const codex = args.join(" ");
	const code = codex.replace("client.token", '"no"');
	try {
		const evaled = eval(code);
		const clean = await client.functions.clean(client, evaled);

		const embed = new Embed()
			.setTitle("Wykonano!")
			.setDescription(`\`\`\`js\n${clean}\n\`\`\``);
		message.reply({ embeds: [embed] });
		message.react("✅");
	} catch (err) {
		message.channel.send(`ERROR`);
		const errorEmbed = new Embed()
			.setTitle("Error")
			.setDescription(
				`\`\`\`xl\n${await client.functions.clean(client, err)}\n\`\`\``
			)
			.setFooter(client.footer);
		message.reply({ embeds: [errorEmbed] });
		message.react("❌");
	}
}

export const help = {
	name: "eval",
	description: "Ewaluuj kod js",
	aliases: ["wykonaj"],
	category: "dev",
};
