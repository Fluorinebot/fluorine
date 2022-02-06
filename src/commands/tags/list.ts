import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { codeBlock, time } from '@discordjs/builders';
import {
    CommandInteraction,
    InteractionReplyOptions,
    MessageActionRow,
    MessageButton
} from 'discord.js';
import r from 'rethinkdb';
import { Tag } from 'types/tag';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const name = interaction.options.getString('tag');

    if (name) {
        const guildCommands = (await interaction.guild.commands.fetch()).map(c => c.name);

        if (!guildCommands.includes(name))
            return interaction.reply({
                content: client.i18n.t('TAG_DOESNT_EXIST', {
                    lng: interaction.locale
                }),
                ephemeral: true
            });

        const tag = (await r
            .table('tags')
            .get(`${interaction.guild.id}-${name}`)
            .run(client.conn)) as Tag;

        const embed = new Embed(client, interaction.locale)
            .setLocaleTitle('TAGS_LIST_SPECIFIC_TITLE')
            .addLocaleField({
                name: 'TAGS_LIST_SPECIFIC_USER',
                value: client.users.cache.get(tag.user).toString()
            })
            .addLocaleField({
                name: 'TAGS_LIST_SPECIFIC_DATE',
                value: time(tag.date, 'D')
            })
            .addLocaleField({
                name: 'TAGS_LIST_SPECIFIC_USES',
                value: tag.uses.toString()
            });

        return interaction.reply({ embeds: [embed] });
    }

    const guild = interaction.guildId;
    const tags = await r
        .table('tags')
        .getAll(guild, { index: 'guild' })
        .coerceTo('array')
        .run(client.conn);

    if (!tags.length)
        return interaction.reply({
            content: client.i18n.t('TAGS_LIST_NO_TAGS', {
                server: interaction.guild.id,
                lng: interaction.locale
            }),
            ephemeral: true
        });

    const chunk = tags.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 4);

        if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);

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

    const replyOptions: InteractionReplyOptions = { embeds: [embed] };
    const row = new MessageActionRow();

    if (chunk.length > 1) {
        row.addComponents(
            new MessageButton()
                .setCustomId(`tagList:${interaction.user.id}:0`)
                .setLabel(
                    client.i18n.t('LISTCASE_BACK', { lng: interaction.locale })
                )
                .setStyle('PRIMARY')
                .setDisabled(true)
        );

        row.addComponents(
            new MessageButton()
                .setCustomId(`tagList:${interaction.user.id}:1`)
                .setLabel(
                    client.i18n.t('LISTCASE_NEXT', { lng: interaction.locale })
                )
                .setStyle('PRIMARY')
        );

        replyOptions.components = [row];
    }

    interaction.reply(replyOptions);
}
