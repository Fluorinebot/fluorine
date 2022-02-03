import FluorineClient from '@classes/Client';
import {
    CommandInteraction,
    MessageActionRow,
    MessageButton
} from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import r from 'rethinkdb';
import { Tag } from 'types/tag';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const name = interaction.options.getString('tag');
    const row = new MessageActionRow();
    const [tag] = (await r
        .table('tags')
        .getAll([interaction.guild.id, name], { index: 'tag' })
        .coerceTo('array')
        .run(client.conn)) as Tag[];

    if (!tag)
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'TAG_DOESNT_EXIST'
            ),
            ephemeral: true
        });

    if (!interaction.memberPermissions.has('MANAGE_GUILD'))
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'TAGS_DELETE_NOT_TAG_OWNER'
            ),
            ephemeral: true
        });

    row.addComponents([
        new MessageButton()
            .setCustomId(`tagDelete:${interaction.user.id}:yes.${name}`)
            .setLabel(
                client.language.get(interaction.locale, 'TAGS_DELETE_CONTINUE')
            )
            .setStyle(MessageButtonStyles.DANGER),
        new MessageButton()
            .setCustomId(`tagDelete:${interaction.user.id}:no.${name}`)
            .setLabel(
                client.language.get(interaction.locale, 'TAGS_DELETE_EXIT')
            )
            .setStyle(MessageButtonStyles.SUCCESS)
    ]);

    interaction.reply({
        content: client.language.get(interaction.locale, 'TAGS_DELETE_PROMPT', {
            tag: name
        }),
        components: [row]
    });
}
