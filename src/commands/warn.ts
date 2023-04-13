import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction<'cached'>) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? client.i18n.t('NONE', { lng: interaction.locale });

    if (!member) {
        return interaction.reply({
            content: client.i18n.t('WARN_MEMBER_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (member.user.id === interaction.user.id) {
        return interaction.reply({
            content: client.i18n.t('WARN_ERROR_YOURSELF', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const caseObj = await client.cases.create(interaction.guildId, member.user, interaction.user, 'warn', reason);

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('WARN_SUCCESS_TITLE')
        .setDescription('WARN_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL())
        .addFields([
            { name: 'WARN_MODERATOR', rawValue: interaction.user.tag },
            { name: 'WARN_USER', rawValue: member.user.tag },
            { name: 'REASON', rawValue: reason },
            { name: 'CASE_ID', rawValue: caseObj.caseId.toString() }
        ]);

    interaction.reply({ embeds: [embed] });
    client.cases.logToModerationChannel(interaction.guildId, caseObj);
}

export const slashCommandData = new SlashCommandBuilder('WARN')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption('USER', (option) => option.setRequired(true))
    .addStringOption('REASON', (option) => option.setMaxLength(1024));

export const category: Category = 'moderation';
