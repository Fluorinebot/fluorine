import AlcanClient from "@classes/Client";
import { Message } from "discord.js";

export interface command {
	run: (client: AlcanClient, message: Message, args: string[]) => void;
	help: {
		name: string;
		category: string;
		aliases: string[];
		description: string;
	};
}
