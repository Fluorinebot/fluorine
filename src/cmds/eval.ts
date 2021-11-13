import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";
import { Util } from "discord.js";
import clean from "@util/clean";

export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	if (message.author.id !== "707675871355600967") {
		return message.reply("ta komenda jest dostepna tylko dla developerow");
	}
	if (args.includes("client.token")) return message.reply("usun client.token ");

	const codex = Util.escapeCodeBlock(args.join(" "));
	const code = codex.replace("client.token", '"no"');
	try {
		const evaled = eval(code);
		const cleant = await clean(client, evaled);

		const embed = new Embed()
			.setTitle("Wykonano!")
			.setDescription(`\`\`\`js\n${cleant}\n\`\`\``);
		message.reply({ embeds: [embed] });
		message.react("✅");
	} catch (err) {
		const errorEmbed = new Embed()
			.setTitle("Error")
			.setDescription(
				`\`\`\`xl\n${await clean(client, err)}\n\`\`\``
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
