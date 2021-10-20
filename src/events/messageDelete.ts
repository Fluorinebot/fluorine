import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message, TextChannel } from "discord.js";
import r from "rethinkdb";
export async function run(client: AlcanClient, message: Message) {
	if (!message.content) return;
	const settings: any = await r
		.table("config")
		.get(message.guild!.id)
		.run(client.conn);
	if (!settings.logs || !settings.logsChannel) return;
	const channel: unknown = client.channels.cache.get(settings.logsChannel);
	const embed = new Embed()
		.setTitle("Usunięto wiadomość")
		.addField("Autor", message.author.tag)
		.addField("Treść", message.content);
	embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
	embed.setFooter(client.footer);
	(channel as TextChannel).send({ embeds: [embed] });
}
