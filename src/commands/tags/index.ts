import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export const data = new SlashCommandBuilder()
    .setName('tags')
    .setDescription('Tag text for later retrieval.')
    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create a tag')
            .addStringOption(option =>
                option.setName('name').setDescription('Name of the tag. 32 characters max.').setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('description')
                    .setDescription('Content of the tag. 100 characters max.')
                    .setRequired(true)
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
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('List all tags, or info on a tag')
            .addStringOption(option =>
                option.setName('tag').setDescription('The tag to list info on').setRequired(false)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Delete a tag')
            .addStringOption(option => option.setName('tag').setDescription('The tag to delete').setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('raw')
            .setDescription('Export the raw content data of a tag')
            .addStringOption(option => option.setName('tag').setDescription('The tag to export').setRequired(true))
    );

export const category: Category = 'tools';
