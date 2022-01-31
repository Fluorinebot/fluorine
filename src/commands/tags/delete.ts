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

    const _guildCommands = [...(await interaction.guild.commands.fetch())];
    const guildCommands = _guildCommands.map(x => x[1].name);

    if (!guildCommands.includes(name))
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'TAG_DOESNT_EXIST'
            ),
            ephemeral: true
        });

    const tag = (await r
        .table('tags')
        .get(`${interaction.guild.id}-${name}`)
        .run(client.conn)) as Tag;

    if (tag.user !== interaction.user.id)
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
