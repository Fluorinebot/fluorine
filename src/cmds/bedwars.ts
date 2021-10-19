import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";
import axios from "axios";
export async function run(
	client: AlcanClient,
	message: Message,
	args: string[]
) {
	if (!args[0])
		return message.reply(
			"Musisz podać gracza! Prawidłowe użycie: bedwars <gracz>"
		);

	const uuid: any = await axios(
		`https://api.mojang.com/users/profiles/minecraft/${args[0]}`
	);
	if (!uuid.data.id)
		return message.reply("Podano nieprawidłowego użytkownika!");

	const { data }: any = await axios(
		`https://api.hypixel.net/player?uuid=${uuid.data.id}&key=${client.config.hypixel}`
	);

	const bedStats = data.player.stats.Bedwars;
	const {
		beds_broken_bedwars,
		kills_bedwars,
		deaths_bedwars,
		wins_bedwars,
		losses_bedwars,
		beds_lost_bedwars,
	} = bedStats;
	const kd = (kills_bedwars / deaths_bedwars).toFixed(2);
	const winratio = (wins_bedwars / losses_bedwars).toFixed(2);
	const bedEmbed = new Embed()
		.setDescription(`K/D: ${kd}\n Win/loss ratio: ${winratio}`)
		.setTitle(`Statystyki gracza ${args[0]}`)
		.addField("Wygrane gry", `${wins_bedwars || "0"}`, true)
		.addField("Przegrane gry", `${losses_bedwars || "0"}`, true)
		.addField("\u200B", "\u200B", true)
		.addField("Zabójstwa", `${kills_bedwars || "0"} `, true)
		.addField("Śmierci", `${deaths_bedwars || "0"}`, true)
		.addField("\u200B", "\u200B", true)
		.addField("Zniszczone łóżka", `${beds_broken_bedwars || "0"}`, true)
		.addField("Stracone łóżka", `${beds_lost_bedwars || "0"}`, true)
		.setThumbnail(
			`https://crafatar.com/avatars/${uuid.data.id}?default=MHF_Steve&overlay`
		)
		.setFooter(client.footer);
	message.reply({ embeds: [bedEmbed] });
}
export const help = {
	name: "bedwars",
	description: "Sprawdź statystyki gracza na bedwarsach z hypixel.net",
	aliases: [],
	category: "fun",
};
