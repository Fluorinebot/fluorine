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
    const value = interaction.options.getString('action');
    const guildId = interaction.guild.id;
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_ANTIBOT_ACTION', {
                lng: interaction.locale
            }),
            value
        });
    interaction.reply({ embeds: [embed] });
    r.table('config').get(guildId).update({ antibot: value }).run(client.conn);
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('antibot-action')
    .setDescription('Set antibot action')
    .addStringOption(option =>
        option
            .setName('action')
            .setDescription('Action to do when antibot is triggered')
            .addChoices([
                ['Ban', 'ban'],
                ['Kick', 'kick'],
                ['Timeout', 'timeout']
            ])
            .setRequired(true)
    );
