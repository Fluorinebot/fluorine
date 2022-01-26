import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export const data = new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('Deploy application commands')
    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create application commands')
            .addStringOption(option =>
                option
                    .setName('command')
                    .setDescription('Provide a command to create')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('guild')
                    .setDescription('Provide a guild to deploy')
                    .setRequired(false)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Delete application commands')
            .addStringOption(option =>
                option
                    .setName('command')
                    .setDescription('Provide a command to delete')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('guild')
                    .setDescription('Provide a guild to deploy')
                    .setRequired(false)
            )
    );

export const category: Category = 'tools';
export const dev = true;
