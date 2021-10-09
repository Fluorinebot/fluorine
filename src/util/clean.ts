import AlcanClient from "@classes/Client";
import { inspect } from "util";
export default async function clean(
	client: AlcanClient,
	text: any
): Promise<string> {
	if (text && text.constructor.name == "Promise") text = await text;
	if (typeof text !== "string") text = inspect(text, { depth: 1 });

	text = text.replaceAll(client.token, "ok");

	return text;
}
