import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";
import createCase from "@util/createCase";
import r from "rethinkdb";
import modLog from "@util/modLog";
export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	if (!message.member?.permissions.has("BAN_MEMBERS")) {
		return message.reply("Nie masz permisji do zbanowania tego użytkownika!");
	}

	if (!args[0]) return message.reply("Musisz podać użykownika");

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

	const create = await createCase(
		client,
		message?.guild!,
		member.user,
		message.author,
		"ban",
		reason
	);
	
	member.ban({ reason: `Zbanowano przez ${message.author.tag} | ${reason}` });
	modLog(client, create, message.guild!);
	const embed = new Embed()
		.setTitle("Zbanowano!")
		.setDescription("Pomyślnie zbanowano członka!")
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.addField("Zbanowany przez:", message.author.tag)
		.addField("Zbanowany:", member.user.tag)
		.addField("Powód", reason || "Brak")
		.addField("ID kary", create.id.toString())
		.setFooter(client.footer);
	message.reply({ embeds: [embed] });

	r.table("case").insert(create).run(client.conn);
}
export const help = {
	name: "ban",
	description: "Zbanuj kogoś z serwera",
	aliases: ["zbanuj"],
	category: "moderation",
};
