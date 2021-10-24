import { command } from "types/command.type";

export default function category(cmd: command) {
	switch (cmd.help.category) {
		case "tools":
			return "Narzędzia";
			break;
		case "fun":
			return "Zabawa";
			break;
		case "moderation":
			return "Moderacja";
			break;
		case "dev":
			return "Developerskie";
			break;
	}
}
