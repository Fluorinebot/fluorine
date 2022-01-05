import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('Deploy application commands')
    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Create application commans')
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
            .setDescription('Delete application commans')
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

export const help = {
    name: 'deploy',
    description: 'Deploy application commands',
    aliases: [],
    category: 'tools'
};
