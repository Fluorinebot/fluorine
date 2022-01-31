import FluorineClient from '@classes/Client';
import { CommandInteraction } from 'discord.js';
import r from 'rethinkdb';
import { Tag } from 'types/tag';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const name = interaction.options.getString('tag');

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

    const creator = interaction.guild.members.fetch(tag.user);

    if (creator)
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'TAGS_TRANSFER_NOT_TRANSFERABLE'
            ),
            ephemeral: true
        });

    // rethink statement

    interaction.reply(
        client.language.get(interaction.locale, 'TAGS_TRANSFER_SUCCESS', {
            tag: name
        })
    );
}
