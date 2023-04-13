import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction<'cached'>) {
    const member = interaction.options.getMember('user');
    const reason =
        interaction.options.getString('reason') ??
        client.i18n.t('NONE', {
            lng: interaction.locale
        });

    if (!member) {
        return interaction.reply({
            content: client.i18n.t('KICK_MEMBER_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (member.user.id === interaction.user.id) {
        return interaction.reply({
            content: client.i18n.t('KICK_ERROR_YOURSELF', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (!member.kickable) {
        return interaction.reply({
            content: client.i18n.t('KICK_BOT_PERMISSIONS_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const caseObj = await client.cases.create(interaction.guildId, member.user, interaction.user, 'kick', reason);

    await member.kick(
        client.i18n.t('KICK_REASON', {
            lng: interaction.locale,
            user: interaction.user.tag,
            reason
        })
    );

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('KICK_SUCCESS_TITLE')
        .setDescription('KICK_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL())
        .addFields([
            { name: 'KICK_MODERATOR', rawValue: interaction.user.tag },
            { name: 'KICK_USER', rawValue: member.user.tag },
            { name: 'REASON', rawValue: reason },
            { name: 'CASE_ID', rawValue: caseObj.caseId.toString() }
        ]);

    interaction.reply({ embeds: [embed] });
    client.cases.logToModerationChannel(interaction.guildId, caseObj);
}

export const slashCommandData = new SlashCommandBuilder('KICK')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption('USER', (option) => option.setRequired(true))
    .addStringOption('REASON', (option) => option.setMaxLength(1024));

export const category: Category = 'moderation';
