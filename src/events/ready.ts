import FluorineClient from '@classes/Client';
export async function run(client: FluorineClient) {
    client.logger.log('Ready!');
    client.statcord.autopost();
}
