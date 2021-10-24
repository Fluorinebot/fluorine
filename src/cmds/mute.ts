import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";
import r from "rethinkdb";
import { SettingsType } from "types/settings.type";

export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	// todo
	return message.reply("Komenda jest w trakcie tworzenia!");
	// @ts-ignore
	const settings: SettingsType = await r
		.table("config")
		.get(message.guild!.id)
		.run(client.conn);
	if (!settings!.muteRole)
		return message.reply(
			"Nie posiadasz skonfigurowanej roli dla mute! Użyj a!config muteRole <oznaczenie roli> aby ją ustawić!"
		);
}

export const help = {
	name: "mute",
	description: "Zmutuj kogoś z serwera",
	aliases: ["zmutuj", "cisza"],
	category: "moderation",
};
