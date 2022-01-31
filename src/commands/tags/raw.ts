import FluorineClient from '@classes/Client';
import {
    BufferResolvable,
    CommandInteraction,
    FileOptions,
    HTTPAttachmentData
} from 'discord.js';
import r from 'rethinkdb';
import { Tag } from 'types/tag';
import { writeFile, readFile } from 'fs';
import { Stream } from 'stream';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const name = interaction.options.getString('tag');

    const guildCommands = [
        ...(await interaction.guild.commands.fetch()).keys()
    ];

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

    const exportData = `
    %NAME ${tag.id.split('.')[1]}
    %CONTENT ${tag.content}
    %EPHEMERAL ${tag.ephemeral}
    `;

    await writeFile('/assets/writes/export.txt', exportData, error => {
        client.logger.error(error.stack);
    });

    let file: FileOptions | BufferResolvable | Stream | HTTPAttachmentData;

    await readFile('/assets/writes/export.txt', (err, data) => {
        if (data) file = data;
        client.logger.error(err.stack);
    });

    interaction.reply({ files: [file] });
}
