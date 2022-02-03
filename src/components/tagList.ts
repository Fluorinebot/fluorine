import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { codeBlock } from '@discordjs/builders';
import { MessageActionRow, MessageButton, ButtonInteraction } from 'discord.js';
import r from 'rethinkdb';

export const authorOnly = true;

export async function run(
    client: FluorineClient,
    interaction: ButtonInteraction,
    value: string
) {
    const page = Number(value);
    const tags = await r
        .table('tags')
        .getAll(interaction.guild.id, { index: 'guild' })
        .coerceTo('array')
        .run(client.conn);

    const chunk = tags.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 4);

        if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);

    const row = new MessageActionRow();
    row.addComponents(
        new MessageButton()
            .setCustomId(`tagsList:${interaction.user.id}:${page - 1}`)
            .setLabel(client.language.get(interaction.locale, 'LISTCASE_BACK'))
            .setStyle('PRIMARY')
            .setDisabled(page === 0)
    );

    row.addComponents(
        new MessageButton()
            .setCustomId(`tagsList:${interaction.user.id}:${page + 1}`)
            .setLabel(client.language.get(interaction.locale, 'LISTCASE_NEXT'))
            .setStyle('PRIMARY')
            .setDisabled(page + 1 === chunk.length)
    );

    const embed = new Embed(client, interaction.locale);
    embed.setLocaleTitle('TAGS_LIST_TITLE', { server: interaction.guild.name });
    embed.setDescription(
        codeBlock(
            'yaml',
            chunk[0]
                .map(x => x.name.replace(`${interaction.guild.id}-`, ''))
                .join(', ')
        )
    );

    interaction.update({ embeds: [embed], components: [row] });
}