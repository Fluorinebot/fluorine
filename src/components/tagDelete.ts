import FluorineClient from '@classes/Client';
import { ButtonInteraction } from 'discord.js';
import r from 'rethinkdb';

export const authorOnly = true;

export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    const [action, tag] = value.split('.');
    let response;

    await interaction.guild.commands.fetch();

    switch (action) {
        case 'yes': {
            const tagCommand = interaction.guild.commands.cache.find(c => c.name === tag);

            const [{ id }] = await r
                .table('tags')
                .getAll([interaction.guild.id, tagCommand.name], {
                    index: 'tag'
                })
                .coerceTo('array')
                .run(client.conn);

            await tagCommand.delete();
            response = client.i18n.t('TAGS_DELETE_SUCCESS', {
                tag,
                lng: interaction.locale
            });

            r.table('tags').get(id).delete().run(client.conn);
            break;
        }

        case 'no': {
            response = client.i18n.t('TAGS_DELETE_ABORT', {
                lng: interaction.locale
            });
            break;
        }
    }

    interaction.update({ content: response, components: [] });
}
