import FluorineClient from '@classes/Client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import r from 'rethinkdb';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const content = interaction.options.getString('content');
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

    const fluorineCommands = [...client.applicationCommands.chatInput.keys()];
    const _guildCommands = [...(await interaction.guild.commands.fetch())];
    const guildCommands = _guildCommands.map(x => x[0]);

    if (fluorineCommands.includes(name))
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'TAGS_CREATE_FLUORINE_OVERRIDE',
                {
                    name
                }
            ),
            ephemeral: true
        });

    if (guildCommands.length >= 100) {
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'TAGS_CREATE_MAXIMUM'
            ),
            ephemeral: true
        });
    }

    if (guildCommands.includes(name))
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'TAGS_CREATE_EXISTING'
            ),
            ephemeral: true
        });

    interaction.guild.commands.create(
        new SlashCommandBuilder()
            .setName(name)
            .setDescription(description)
            .toJSON()
    );

    const tagData = {
        guild: interaction.guild.id,
        name,
        content,
        ephemeral,
        created: Date.now(),
        user: interaction.user.id,
        uses: 0
    };

    r.table('tags').insert(tagData).run(client.conn);
    interaction.reply(
        client.language.get(interaction.locale, 'TAGS_CREATE_SUCCESS', {
            tag: name
        })
    );
}
