import AlcanClient from "@classes/Client";
export async function run(client: AlcanClient) {
	client.logger.log("Ready!");
	client.statcord.autopost().then(console.log);
}
