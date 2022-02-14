import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { ButtonInteraction, MessageActionRow, MessageButton } from 'discord.js';
export const authorOnly = true;
export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    let embed: Embed;
    const row = new MessageActionRow().addComponents([
        new MessageButton()
            .setLabel(client.i18n.t('INFO', { lng: interaction.locale }))
            .setDisabled(value === 'info')
            .setCustomId(`info:${interaction.user.id}:info`)
            .setStyle('PRIMARY'),
        new MessageButton()
            .setLabel(client.i18n.t('INFO_STATS', { lng: interaction.locale }))
            .setDisabled(value === 'stats')
            .setCustomId(`info:${interaction.user.id}:stats`)
            .setStyle('PRIMARY')
    ]);
    if (value === 'info') {
        embed = new Embed(client, interaction.locale)
            .setLocaleTitle('INFO_TITLE')
            .setLocaleDescription('INFO_DESCRIPTION')
            .addLocaleField({
                name: 'INFO_DEVELOPERS',
                value: 'kubus#0242\nnightlake#3370\nSuperchupu#5249',
                inline: true
            })
            .addLocaleField({
                name: 'INFO_THANKS',
                value: 'ArsBeneMoriendi#1422\nLunah#3131',
                inline: true
            })
            .addField('\u200B', '\u200B', true)
            .addLocaleField({
                name: 'INFO_LANGUAGES',
                value: 'en-US, pl',
                inline: true
            })
            .addLocaleField({
                name: 'INFO_VERSION',
                value: client.version,
                inline: true
            });
    } else {
        embed = new Embed(client, interaction.locale)
            .setLocaleTitle('INFO_STATS_TITLE')
            .addLocaleField({
                name: 'INFO_STATS_RAM',
                value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
                inline: true
            })
            .addLocaleField({
                name: 'INFO_STATS_SERVERS',
                value: client.guilds.cache.size.toString(),
                inline: true
            })
            .addLocaleField({
                name: 'INFO_STATS_USERS',
                value: client.users.cache.size.toString(),
                inline: true
            })
            .addLocaleField({
                name: 'INFO_STATS_CHANNELS',
                value: client.channels.cache.size.toString(),
                inline: true
            })
            .addLocaleField({
                name: 'INFO_STATS_COMMANDS',
                value: client.applicationCommands.chatInput.size.toString(),
                inline: true
            })
            .addLocaleField({
                name: 'INFO_STATS_PING',
                value: `${client.ws.ping}ms`,
                inline: true
            });
    }
    interaction.reply({ embeds: [embed], components: [row] });
}
