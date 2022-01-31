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

    switch (action) {
        case 'yes': {
            const tagCommand = interaction.guild.commands.cache.get(tag);
            interaction.guild.commands.delete(tagCommand.id);
            response = client.language.get(
                interaction.locale,
                'TAGS_DELETE_SUCCESS',
                { tag }
            );
            // rethink statement
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
