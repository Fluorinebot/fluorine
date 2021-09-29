import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";

export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	if (!message.member?.permissions.has("BAN_MEMBERS")) {
		return message.reply("Nie masz permisji do zbanowania tego użytkownika!")
	}

	if (!args[0])
		return message.reply("Członek którego chcesz zbanować nie istnieje!");

	const member =
			message.mentions.members?.first() ||
			(await message.guild?.members.fetch(args[0]).catch(() => {})),
		reason = args.slice(1).join(" ") || "Brak powodu";

	if (!member)
		return message.reply("Członek którego chcesz zbanować nie istnieje!");
	if (!member?.bannable)
		return message.reply(
			"Nie można zbanować tego członka, sprawdź czy bot posiada permisje"
		);
	if (reason.length > 1024) {
		message.reply("Powód nie może być dłuższy niż 1024");
	}

	member.kick(`Zbanowano przez ${message.author.tag} | ${reason}`);

	const embed = new Embed()
		.setTitle("Zbanowano!")
		.setDescription("Pomyślnie zbanowano członka!")
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.addField("Zbanowano przez:", message.author.tag)
		.addField("Zbanowano:", member.user.tag)
		.addField("Powód", reason)
		.setFooter(client.footer);
	message.reply({ embeds: [embed] });
}
export const help = {
	name: "ban",
	description: "Zbanuj kogoś z serwera",
	aliases: ["zbanuj"],
	category: "moderation",
};
