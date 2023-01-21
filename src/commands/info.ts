import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category, ComponentData } from '#types';
import { getDirname } from '#util';

import { ButtonStyle, type ButtonInteraction, type ChatInputCommandInteraction } from 'discord.js';

export async function onInteraction(
    client: FluorineClient,
    interaction: ButtonInteraction | ChatInputCommandInteraction,
    value: 'info' | 'stats' = 'info'
) {
    const embed = new EmbedBuilder(client, interaction.locale);

    if (value === 'info') {
        const developers = (await Promise.all(client.devs.map(async id => (await client.users.fetch(id)).tag))).join(
            '\n'
        );

        const thanks = (
            await Promise.all(
                ['709446362252443760', '603635602809946113'].map(async id => (await client.users.fetch(id)).tag)
            )
        ).join('\n');

        const langs = (await readdir(join(getDirname(import.meta.url), '../../i18n'))).map(file => file.split('.')[0]);

        embed
            .setTitle('INFO_TITLE')
            .setDescription('INFO_DESCRIPTION')
            .addFields(
                {
                    name: 'INFO_DEVELOPERS',
                    rawValue: developers,
                    inline: true
                },
                {
                    name: 'INFO_THANKS',
                    rawValue: thanks,
                    inline: true
                },
                { rawName: '\u200B', rawValue: '\u200B', inline: true },
                {
                    name: 'INFO_LANGUAGES',
                    rawValue: langs.join(', '),
                    inline: true
                },
                {
                    name: 'INFO_VERSION',
                    rawValue: client.version,
                    inline: true
                }
            );
    }

    if (value === 'stats') {
        embed.setTitle('INFO_STATS_TITLE').addFields(
            {
                name: 'INFO_STATS_RAM',
                rawValue: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
                inline: true
            },
            {
                name: 'INFO_STATS_SERVERS',
                rawValue: client.guilds.cache.size.toString(),
                inline: true
            },
            {
                name: 'INFO_STATS_USERS',
                rawValue: client.users.cache.size.toString(),
                inline: true
            },
            {
                name: 'INFO_STATS_CHANNELS',
                rawValue: client.channels.cache.size.toString(),
                inline: true
            },
            {
                name: 'INFO_STATS_COMMANDS',
                rawValue: client.chatInputCommands.size.toString(),
                inline: true
            },
            {
                name: 'INFO_STATS_PING',
                rawValue: `${client.ws.ping}ms`,
                inline: true
            }
        );
    }

    const row = new ActionRowBuilder(interaction.locale).addComponents(
        new ButtonBuilder(`info:${interaction.user.id}:info`)
            .setLabel('INFO')
            .setDisabled(value === 'info')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder(`info:${interaction.user.id}:stats`)
            .setLabel('INFO_STATS')
            .setDisabled(value === 'stats')
            .setStyle(ButtonStyle.Primary)
    );

    const options = {
        embeds: [embed],
        components: [row]
    };

    interaction.isChatInputCommand() ? interaction.reply(options) : interaction.update(options);
}

export const componentData: ComponentData = {
    exists: true,
    name: 'info',
    authorOnly: true
};

export const slashCommandData = new SlashCommandBuilder('INFO');
export const category: Category = 'tools';
