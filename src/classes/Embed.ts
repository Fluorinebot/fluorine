import { MessageEmbed } from "discord.js";
export default class Embed extends MessageEmbed {
	constructor() {
		super({});
		this.setColor("#3872f2");
		this.setTimestamp();
	}
}
