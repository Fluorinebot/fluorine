import FluorineClient from '@classes/Client';
import { codeBlock } from '@discordjs/builders';
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

    const exportData = `
name: ${tag.id.split('.')[1]}
content: ${tag.content}
ephemeral: ${tag.ephemeral}
`;

    interaction.reply(codeBlock('yaml', exportData));
}
