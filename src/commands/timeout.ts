import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import ms, { type StringValue } from 'ms';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction<'cached'>) {
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

    const caseObj = await client.cases.create(interaction.guildId, member.user, interaction.user, 'timeout', reason);

    await member.timeout(
        duration,
        client.i18n.t('TIMEOUT_REASON', {
            lng: interaction.locale,
            user: interaction.user.tag,
            reason
        })
    );

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('TIMEOUT_SUCCESS_TITLE')
        .setDescription('TIMEOUT_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL())
        .addFields([
            { name: 'TIMEOUT_MODERATOR', rawValue: interaction.user.tag },
            { name: 'TIMEOUT_USER', rawValue: member.user.tag },
            { name: 'DURATION', rawValue: ms(duration) },
            { name: 'REASON', rawValue: reason },
            { name: 'CASE_ID', rawValue: caseObj.caseId.toString() }
        ]);

    interaction.reply({ embeds: [embed] });
    client.cases.logToModerationChannel(interaction.guildId, caseObj);
}

export const slashCommandData = new SlashCommandBuilder('TIMEOUT')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption('USER', option => option.setRequired(true))
    .addStringOption('DURATION', option => option.setRequired(true))
    .addStringOption('REASON', option => option.setMaxLength(1024));

export const category: Category = 'moderation';
