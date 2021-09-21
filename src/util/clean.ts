import AlcanClient from "@classes/Client";
export default async function clean(
	client: AlcanClient,
	text: any
): Promise<string> {
	if (text && text.constructor.name == "Promise") text = await text;
	if (typeof text !== "string")
		text = require("util").inspect(text, { depth: 1 });

	text = text
		.replace(/`/g, "`" + String.fromCharCode(8203))
		.replace(/@/g, "@" + String.fromCharCode(8203))
		.replaceAll(
			client.token,
			"mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0"
		);

	return text;
}
