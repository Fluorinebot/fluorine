import FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction } from 'discord.js';
import { join } from 'path';
import { readdir } from 'fs/promises';

export async function getEmbed(client: FluorineClient, interaction: Interaction, page: 'info' | 'stats') {
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

        const langs = (await readdir(join(__dirname, '../../i18n'))).map(file => file.split('.')[0]);

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
                value: client.commands.chatInput.size.toString(),
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

export function getComponents(client: FluorineClient, interaction: Interaction, page: 'info' | 'stats') {
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
