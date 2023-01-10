import { SlashCommandBuilder } from '#builders';
import { Embed, type FluorineClient } from '#classes';
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

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('WARN_SUCCESS_TITLE')
        .setLocaleDescription('WARN_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL())
        .addLocaleFields([
            { name: 'WARN_MODERATOR', value: interaction.user.tag },
            { name: 'WARN_USER', value: member.user.tag },
            { name: 'REASON', value: reason },
            { name: 'CASE_ID', value: caseObj.caseId.toString() }
        ]);

    interaction.reply({ embeds: [embed] });
    client.cases.logToModerationChannel(interaction.guildId, caseObj);
}

export const slashCommandData = new SlashCommandBuilder()
    .setName('warn')
    .setNameLocalizations({ pl: 'ostrzeżenie' })
    .setDescription('Warn a user from the server')
    .setDescriptionLocalizations({ pl: 'Daj użytkownikowi ostrzeżenie' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'użytkownik' })
            .setDescription('Provide a user to warn')
            .setDescriptionLocalizations({ pl: 'Podaj użytkownika, któremu chcesz wstawić ostrzeżenie' })
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setNameLocalizations({ pl: 'powód' })
            .setDescription('Provide a reason for warning this user')
            .setDescriptionLocalizations({ pl: 'Podaj powód ostrzeżenia' })
            .setMaxLength(1024)
            .setRequired(false)
    );

export const category: Category = 'moderation';
