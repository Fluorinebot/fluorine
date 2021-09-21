import AlcanClient from "@classes/Client";
import Logger from "@classes/Logger";

export async function run(client: AlcanClient) {
	client.logger.log("Ready!");
}
