export default function category(cmd: any) {
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
