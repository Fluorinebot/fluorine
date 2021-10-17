import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import createCase from "@util/createCase";
import r from "rethinkdb";
import { Message } from "discord.js";
import modLog from "@util/modLog";

export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	if (!args[0]) return message.reply("Musisz podać użytkownika!");
	if (!message.member?.permissions.has("KICK_MEMBERS")) {
		return message.reply("Nie masz permisji do wyrzucenia tego użytkownika!");
	}
	const member =
			message.mentions.members?.first() ||
			(await message.guild?.members.fetch(args[0]).catch(() => {})),
		reason = args.slice(1).join(" ") || "Brak powodu";

	if (!member)
		return message.reply("Członek którego chcesz wyrzucić nie istnieje!");
	if (!member?.kickable)
		return message.reply(
			"Nie można wyrzucić tego członka, sprawdź czy bot posiada permisje"
		);

	if (reason.length > 1024) {
		message.reply("Powód nie może być dłuższy niż 1024");
	}

	member.kick(`Wyrzucono przez ${message.author.tag} | ${reason}`);
	const create = await createCase(
		client,
		message?.guild!,
		member.user,
		message.author,
		"kick",
		reason
	);
	r.table("case").insert(create);
	modLog(client, create, message.guild!);
	const embed = new Embed()
		.setTitle("Wyrzucono!")
		.setDescription("Pomyślnie wyrzucono członka!")
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.addField("Wyrzucony przez:", message.author.tag)
		.addField("Wyrzucony:", member.user.tag)
		.addField("Powód", reason)
		.addField("ID kary", create.id)
		.setFooter(client.footer);
	message.reply({ embeds: [embed] });
	r.table("case").insert(create).run(client.conn);
}
export const help = {
	name: "kick",
	description: "Wyrzuć kogoś z serwera",
	aliases: ["wyrzuć"],
	category: "moderation",
};
