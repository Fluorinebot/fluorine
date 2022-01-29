import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';
export const data = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View/set a profile')
    .addSubcommand(command =>
        command
            .setName('set')
            .setDescription('Set a profile')
            .addStringOption(option =>
                option
                    .setName('field')
                    .setDescription('Field to set')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('value')
                    .setDescription('Value to set')
                    .setRequired(true)
                    .setChoices([
                        ['Description', 'description'],
                        ['Website', 'website'],
                        ['Birthday', 'birthday'],
                        ['Location', 'location'],
                        ['Pronouns', 'pronouns']
                    ])
            )
    )
    .addSubcommand(command =>
        command
            .setName('get')
            .setDescription('View a profile')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('User to view')
                    .setRequired(false)
            )
    );
export const category: Category = 'tools';
