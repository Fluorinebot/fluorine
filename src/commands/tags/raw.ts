import FluorineClient from '@classes/Client';
import { codeBlock, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import r from 'rethinkdb';
import { Tag } from 'types/tag';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const name = interaction.options.getString('tag');

    const guildCommands = (await interaction.guild.commands.fetch()).map(c => c.name);

    if (!guildCommands.includes(name))
        return interaction.reply({
            content: client.i18n.t('TAG_DOESNT_EXIST', {
                lng: interaction.locale
            }),
            ephemeral: true
        });

    const [tag] = (await r
        .table('tags')
        .getAll([interaction.guild.id, name], { index: 'tag' })
        .coerceTo('array')
        .run(client.conn)) as Tag[];

    const exportData = `
name: ${tag.name.split('-')[1]}
content: ${tag.content}
ephemeral: ${tag.ephemeral}
`;

    interaction.reply(codeBlock('yaml', exportData));
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('raw')
    .setDescription('Export the raw content data of a tag')
    .addStringOption(option => option.setName('tag').setDescription('The tag to export').setRequired(true));
