import FluorineClient from '@classes/Client';
import { ButtonInteraction } from 'discord.js';
import r from 'rethinkdb';

export const authorOnly = true;

export async function run(
    client: FluorineClient,
    interaction: ButtonInteraction,
    value: string
) {
    const [action, tag] = value.split('.');
    let response;

    // @ts-ignore
    await interaction.guild.commands.fetch();

    switch (action) {
        case 'yes': {
            const tagCommand = interaction.guild.commands.cache.find(
                c => c.name === tag
            );

            const [{ id }] = await r
                .table('tags')
                .getAll([interaction.guild.id, tagCommand.name], {
                    index: 'tag'
                })
                .coerceTo('array')
                .run(client.conn);

            await tagCommand.delete();
            response = client.language.get(
                interaction.locale,
                'TAGS_DELETE_SUCCESS',
                { tag }
            );

            r.table('tags').get(id).delete().run(client.conn);
            break;
        }

        case 'no': {
            response = client.language.get(
                interaction.locale,
                'TAGS_DELETE_ABORT'
            );
            break;
        }
    }

    interaction.update({ content: response, components: [] });
}
