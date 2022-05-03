import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import ms, { StringValue } from 'ms';
import { Category } from 'types/structures';

export async function run(client: FluorineClient, interaction: CommandInteraction<'cached'>) {
    if (!interaction.member?.permissions.has('MODERATE_MEMBERS')) {
        return interaction.reply({
            content: client.i18n.t('TIMEOUT_PERMISSIONS_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const member = interaction.options.getMember('user');
    const duration = ms(interaction.options.getString('duration') as StringValue);
    const reason = interaction.options.getString('reason') ?? client.i18n.t('NONE', { lng: interaction.locale });

    if (!member) {
        return interaction.reply({
            content: client.i18n.t('TIMEOUT_MEMBER_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (member.user.id === interaction.user.id) {
        return interaction.reply({
            content: client.i18n.t('TIMEOUT_ERROR_YOURSELF', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (!member.moderatable) {
        return interaction.reply({
            content: client.i18n.t('TIMEOUT_BOT_PERMISSIONS_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (Number.isNaN(duration) || duration > 2419200000) {
        return interaction.reply({
            content: client.i18n.t('TIMEOUT_DURATION_INVALID', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (reason.length > 1024) {
        return interaction.reply({
            content: client.i18n.t('REASON_LONGER_THAN_1024', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const caseObj = await client.cases.create(interaction.guildId, member.user, interaction.user, 'timeout', reason);

    await member.timeout(
        duration,
        client.i18n.t('TIMEOUT_REASON', {
            lng: interaction.locale,
            user: interaction.user.tag,
            reason
        })
    );

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('TIMEOUT_SUCCESS_TITLE')
        .setLocaleDescription('TIMEOUT_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addLocaleField({
            name: 'TIMEOUT_MODERATOR',
            value: interaction.user.tag
        })
        .addLocaleField({ name: 'TIMEOUT_USER', value: member.user.tag })
        .addLocaleField({ name: 'DURATION', value: ms(duration) })
        .addLocaleField({ name: 'REASON', value: reason })
        .addLocaleField({ name: 'CASE_ID', value: caseObj.case_id.toString() });

    interaction.reply({ embeds: [embed] });
    client.cases.logToModerationChannel(interaction.guildId, caseObj);
}

export const data = new SlashCommandBuilder()
    .setName('timeout')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Timeout a user from the server')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Provide a user to timeout')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('duration')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Provide how long the timeout will last')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Provide a reason for timing out this user')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(false)
    );

export const category: Category = 'moderation';
