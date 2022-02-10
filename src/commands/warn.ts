import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import createCase from '@util/createCase';
import modLog from '@util/modLog';
import { CommandInteraction } from 'discord.js';
import r from 'rethinkdb';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction<'cached'>) {
    if (!interaction.member?.permissions.has('MODERATE_MEMBERS')) {
        return interaction.reply({
            content: client.i18n.t('WARN_PERMISSIONS_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? client.i18n.t('NONE', { lng: interaction.locale });

    if (!member)
        return interaction.reply({
            content: client.i18n.t('WARN_MEMBER_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });

    if (member.user.id === interaction.user.id)
        return interaction.reply({
            content: client.i18n.t('WARN_ERROR_YOURSELF', {
                lng: interaction.locale
            }),
            ephemeral: true
        });

    if (reason.length > 1024) {
        return interaction.reply({
            content: client.i18n.t('REASON_LONGER_THAN_1024', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const create = await createCase(client, interaction?.guild, member.user, interaction.user, 'warn', reason);

    modLog(client, create, interaction.guild);
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('WARN_SUCCESS_TITLE')
        .setLocaleDescription('WARN_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'WARN_MODERATOR', value: interaction.user.tag })
        .addLocaleField({ name: 'WARN_USER', value: member.user.tag })
        .addLocaleField({ name: 'REASON', value: reason })
        .addLocaleField({ name: 'PUNISHMENT_ID', value: create.id.toString() });
    interaction.reply({ embeds: [embed] });

    r.table('case').insert(create).run(client.conn);
}

export const data = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn an user from the server')
    .addUserOption(option => option.setName('user').setDescription('Provide an user to warn').setRequired(true))
    .addStringOption(option =>
        option.setName('reason').setDescription('Provide a reason for warning this user').setRequired(false)
    );

export const category: Category = 'moderation';
