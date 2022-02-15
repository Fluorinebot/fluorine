import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export const data = new SlashCommandBuilder()
    .setName('dev')
    .setDescription("Commands intended to ease in Fluorine's development.")
    .addSubcommand(subcommand =>
        subcommand
            .setName('reload')
            .setDescription('Reloads a module.')
            .addStringOption(option =>
                option
                    .setName('type')
                    .setDescription('The type of the module.')
                    .setRequired(true)
                    .setChoices([
                        ['Event', 'events'],
                        ['Chat Input Command', 'commands'],
                        ['Context Menu Command', 'context'],
                        ['Component', 'components']
                    ])
            )
            .addStringOption(option =>
                option.setName('module').setDescription("The module that you're reloading.").setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('shell')
            .setDescription('Execute a shell script')
            .addStringOption(option => option.setName('script').setDescription('The shell script.').setRequired(true))
    )
    .addSubcommand(subcommand => subcommand.setName('update').setDescription('Update the bot.'));

if (process.env.NODE_ENV === 'development') {
    data.addSubcommand(subcommand =>
        subcommand
            .setName('eval')
            .setDescription('Evaluates a given exprssion.')
            .addStringOption(option => option.setName('code').setDescription('The code to evaluate.').setRequired(true))
    );
}

export const category: Category = 'tools';
export const dev = true;
