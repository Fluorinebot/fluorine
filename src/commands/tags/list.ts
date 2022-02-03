import FluorineClient from '@classes/Client';
import { CommandInteraction } from 'discord.js';
import r from 'rethinkdb';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const guild = interaction.guild.id;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const list = await r
        .table('tags')
        .getAll(guild, { index: 'guild' })
        .coerceTo('array')
        .run(client.conn);
}
