import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message, TextChannel } from "discord.js";
import r from "rethinkdb";
import { SettingsType } from "types/settings.type";
export async function run(
	client: AlcanClient,
	oldMessage: Message,
	newMessage: Message
) {
	if (!newMessage || newMessage.content === oldMessage.content) return;
	// @ts-ignore
	const settings: SettingsType = await r
		.table("config")
		.get(newMessage.guild!.id)
		.run(client.conn);
	if (!settings.logs || !settings.logsChannel) return;
	const channel: unknown = client.channels.cache.get(settings.logsChannel);
	const { author } = newMessage;
	const embed = new Embed()
		.setTitle("Zedytowano wiadomość")
		.addField("Autor", author.tag)
		.addField("Stara treść", oldMessage.content)
		.addField("Nowa treść", newMessage.content)
		.setThumbnail(author.displayAvatarURL({ dynamic: true }))
		.setFooter(client.footer);

	(channel as TextChannel).send({ embeds: [embed] });
}
