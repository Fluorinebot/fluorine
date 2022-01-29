import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types';
import { Category } from 'types/applicationCommand';
export const data = new SlashCommandBuilder()
    .setName('config')
    .setDescription('Set your guilds config')
    .addSubcommand(command =>
        command
            .setName('prefix')
            .setDescription('Set the prefix for your guild')
            .addStringOption(option =>
                option
                    .setName('prefix')
                    .setDescription('The prefix you want to set')
                    .setRequired(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('antibot')
            .setDescription('Set antibot factor! (Use 0 for disabled)')
            .addNumberOption(option =>
                option
                    .setName('factor')
                    .setDescription('Antibot factor')
                    .setMinValue(0)
                    .setMaxValue(100)
                    .setRequired(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('antibot-action')
            .setDescription('Set antibot action')
            .addStringOption(option =>
                option
                    .setName('action')
                    .setDescription('Action to do when antibot is triggered')
                    .addChoices([
                        ['Ban', 'Ban'],
                        ['Kick', 'Kick'],
                        ['Timeout', 'timeout']
                    ])
                    .setRequired(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('logs')
            .setDescription('Set if you want to log messages')
            .addBooleanOption(option =>
                option
                    .setName('logs')
                    .setDescription('Set whether you want to log messages')
                    .setRequired(true)
            )
    )

    .addSubcommand(command =>
        command
            .setName('logs-channel')
            .setDescription('Set the channel for logs')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Channel for logs')
                    .addChannelType(ChannelType.GuildText)
                    .setRequired(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('mod-logs')
            .setDescription('Set if you want to log moderation actions')
            .addBooleanOption(option =>
                option
                    .setName('mod-logs')
                    .setDescription(
                        'Set whether you want to log moderation actions'
                    )
                    .setRequired(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('currency')
            .setDescription('Set the currency')
            .addStringOption(option =>
                option
                    .setName('currency')
                    .setDescription('The currency you want to set')
                    .setRequired(true)
            )
    );
export const category: Category = 'tools';
