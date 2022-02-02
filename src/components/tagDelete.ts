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
            r.table('tags')
                .get(`${interaction.guild.id}-${tag}`)
                .delete()
                .run(client.conn);

            const command = interaction.guild.commands.cache.find(
                c => c.name === tag
            );
            await command.delete();

            response = client.language.get(
                interaction.locale,
                'TAGS_DELETE_SUCCESS',
                { tag }
            );
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
