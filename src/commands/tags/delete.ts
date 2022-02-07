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
    const [tag] = (await r
        .table('tags')
        .getAll([interaction.guild.id, name], { index: 'tag' })
        .coerceTo('array')
        .run(client.conn)) as Tag[];

    if (!tag)
        return interaction.reply({
            content: client.i18n.t('TAG_DOESNT_EXIST', {
                lng: interaction.locale
            }),
            ephemeral: true
        });

    if (!interaction.memberPermissions.has('MANAGE_GUILD'))
        return interaction.reply({
            content: client.i18n.t('TAGS_DELETE_NOT_TAG_OWNER', {
                lng: interaction.locale
            }),
            ephemeral: true
        });

    const row = new MessageActionRow().addComponents([
        new MessageButton()
            .setCustomId(`tagDelete:${interaction.user.id}:yes.${name}`)
            .setLabel(
                client.i18n.t('TAGS_DELETE_CONTINUE', {
                    lng: interaction.locale
                })
            )
            .setStyle(MessageButtonStyles.DANGER),
        new MessageButton()
            .setCustomId(`tagDelete:${interaction.user.id}:no.${name}`)
            .setLabel(
                client.i18n.t('TAGS_DELETE_EXIT', {
                    lng: interaction.locale
                })
            )
            .setStyle(MessageButtonStyles.SUCCESS)
    ]);

    interaction.reply({
        content: client.i18n.t('TAGS_DELETE_PROMPT', {
            tag: name,
            lng: interaction.locale
        }),
        components: [row]
    });
}
