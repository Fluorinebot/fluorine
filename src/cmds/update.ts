import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";
import { exec } from "child_process";

export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	if (message.author.id !== "707675871355600967") {
		return message.reply("ta komenda jest dostepna tylko dla developerów.");
	}
	exec("git pull", (err, stdout, stderr) => {
		message.reply("zaktualizowano");
		exec("npm run build", () => {});
	});
}
export const help = {
	name: "update",
	description: "Aktualizuj bota",
	aliases: ["aktualizuj"],
	category: "dev",
};
