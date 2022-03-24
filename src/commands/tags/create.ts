import FluorineClient from '@classes/Client';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import r from 'rethinkdb';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const content = interaction.options.getString('content');
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

    const fluorineCommands = [...client.applicationCommands.chatInput.keys()];
    const guildCommands = await interaction.guild.commands.fetch();

    if (fluorineCommands.includes(name)) {
        return interaction.reply({
            content: client.i18n.t('TAGS_CREATE_FLUORINE_OVERRIDE', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (guildCommands.size >= 100) {
        return interaction.reply({
            content: client.i18n.t('TAGS_CREATE_MAXIMUM', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (guildCommands.has(name)) {
        return interaction.reply({
            content: client.i18n.t('TAGS_CREATE_EXISTING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    interaction.guild.commands.create(new SlashCommandBuilder().setName(name).setDescription(description).toJSON());

    const tagData = {
        guild: interaction.guild.id,
        name,
        content,
        ephemeral,
        created: Math.round(Date.now() / 1000),
        user: interaction.user.id,
        uses: 0
    };

    r.table('tags').insert(tagData).run(client.conn);
    interaction.reply(
        client.i18n.t('TAGS_CREATE_SUCCESS', {
            tag: name,
            lng: interaction.locale
        })
    );
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create a tag')
    .addStringOption(option =>
        option.setName('name').setDescription('Name of the tag. 32 characters max.').setRequired(true)
    )
    .addStringOption(option =>
        option.setName('description').setDescription('Content of the tag. 100 characters max.').setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('content')
            .setDescription('Content of the tag. See docs.fluorine.me/tags#syntax for syntax.')
            .setRequired(true)
    )
    .addBooleanOption(option =>
        option
            .setName('ephemeral')
            .setDescription('Whether this tag should be displayed to everyone or just the person viewing it.')
            .setRequired(false)
    );
