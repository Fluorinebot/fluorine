import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { time } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import r from 'rethinkdb';
import { Tag } from 'types/tag';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const name = interaction.options.getString('tag');

    if (name) {
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

        const embed = new Embed(client, interaction.locale);
        embed.setLocaleTitle('TAGS_LIST_SPECIFIC_TITLE');

        embed.addLocaleField({
            name: 'TAGS_LIST_SPECIFIC_USER',
            value: client.users.cache.get(tag.user).toString()
        });

        embed.addLocaleField({
            name: 'TAGS_LIST_SPECIFIC_DATE',
            value: time(tag.date, 'D')
        });

        embed.addLocaleField({
            name: 'TAGS_LIST_SPECIFIC_USES',
            value: tag.uses.toString()
        });

        return interaction.reply({ embeds: [embed] });
    }
}
