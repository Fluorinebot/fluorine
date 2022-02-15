import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageButton, MessageActionRow } from 'discord.js';
export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const embed = new Embed(client, interaction.locale)
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
    const row = new MessageActionRow().addComponents([
        new MessageButton()
            .setLabel(client.i18n.t('INFO', { lng: interaction.locale }))
            .setDisabled(true)
            .setCustomId(`info:${interaction.user.id}:info`)
            .setStyle('PRIMARY'),
        new MessageButton()
            .setLabel(client.i18n.t('INFO_STATS', { lng: interaction.locale }))
            .setCustomId(`info:${interaction.user.id}:stats`)
            .setStyle('PRIMARY')
    ]);
    interaction.reply({ embeds: [embed], components: [row] });
}
export const data = new SlashCommandBuilder().setName('info').setDescription('Information about fluorine');
