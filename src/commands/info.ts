import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { Embed, type FluorineClient } from '#classes';
import type { Category, ComponentData } from '#types';
import { getDirname } from '#util';
import {
    type ChatInputCommandInteraction,
    type Interaction,
    type ButtonInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';

async function getEmbed(client: FluorineClient, interaction: Interaction, page: string) {
    const embed = new Embed(client, interaction.locale);

    if (page === 'info') {
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
            .setLocaleTitle('INFO_TITLE')
            .setLocaleDescription('INFO_DESCRIPTION')
            .addLocaleFields([
                {
                    name: 'INFO_DEVELOPERS',
                    value: developers,
                    inline: true
                },
                {
                    name: 'INFO_THANKS',
                    value: thanks,
                    inline: true
                },
                { name: '\u200B', value: '\u200B', inline: true },
                {
                    name: 'INFO_LANGUAGES',
                    value: langs.join(', '),
                    inline: true
                },
                {
                    name: 'INFO_VERSION',
                    value: client.version,
                    inline: true
                }
            ]);
    }

    if (page === 'stats') {
        embed.setLocaleTitle('INFO_STATS_TITLE').addLocaleFields([
            {
                name: 'INFO_STATS_RAM',
                value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
                inline: true
            },
            {
                name: 'INFO_STATS_SERVERS',
                value: client.guilds.cache.size.toString(),
                inline: true
            },
            {
                name: 'INFO_STATS_USERS',
                value: client.users.cache.size.toString(),
                inline: true
            },
            {
                name: 'INFO_STATS_CHANNELS',
                value: client.channels.cache.size.toString(),
                inline: true
            },
            {
                name: 'INFO_STATS_COMMANDS',
                value: client.chatInputCommands.size.toString(),
                inline: true
            },
            {
                name: 'INFO_STATS_PING',
                value: `${client.ws.ping}ms`,
                inline: true
            }
        ]);
    }

    return embed;
}

function getComponents(client: FluorineClient, interaction: Interaction, page: string) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
            .setLabel(client.i18n.t('INFO', { lng: interaction.locale }))
            .setDisabled(page === 'info')
            .setCustomId(`info:${interaction.user.id}:info`)
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setLabel(client.i18n.t('INFO_STATS', { lng: interaction.locale }))
            .setDisabled(page === 'stats')
            .setCustomId(`info:${interaction.user.id}:stats`)
            .setStyle(ButtonStyle.Primary)
    ]);

    return row;
}

export async function onInteraction(
    client: FluorineClient,
    interaction: ButtonInteraction | ChatInputCommandInteraction,
    value?: string
) {
    const options = {
        embeds: [await getEmbed(client, interaction, value ?? 'info')],
        components: [getComponents(client, interaction, value ?? 'info')]
    };
    interaction.isChatInputCommand() ? interaction.reply(options) : interaction.update(options);
}

export const componentData: ComponentData = {
    exists: true,
    name: 'info',
    authorOnly: true
};

export const slashCommandData = new SlashCommandBuilder()
    .setName('info')
    .setNameLocalizations({ pl: 'informacje' })
    .setDescription('Information about Fluorine')
    .setDescriptionLocalizations({ pl: 'Informacje o Fluorine' });

export const category: Category = 'tools';
