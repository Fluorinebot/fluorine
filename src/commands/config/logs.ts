import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import r from 'rethinkdb';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
export async function run(client: FluorineClient, interaction: CommandInteraction) {
    if (!interaction.memberPermissions.has('MANAGE_GUILD')) {
        return interaction.reply({
            content: client.i18n.t('CONFIG_FAIL', { lng: interaction.locale }),
            ephemeral: true
        });
    }
    const value = interaction.options.getBoolean('logs');
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_LOGS', { lng: interaction.locale }),
            value
        });
    interaction.reply({ embeds: [embed] });
    r.table('config').get(interaction.guildId).update({ logs: value }).run(client.conn);
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('logs')
    .setDescription('Set if you want to log messages')
    .addBooleanOption(option =>
        option.setName('logs').setDescription('Set whether you want to log messages').setRequired(true)
    );
