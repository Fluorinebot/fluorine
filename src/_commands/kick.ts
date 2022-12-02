import { Embed, type FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction<'cached'>) {
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

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('KICK_SUCCESS_TITLE')
        .setLocaleDescription('KICK_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL())
        .addLocaleFields([
            { name: 'KICK_MODERATOR', value: interaction.user.tag },
            { name: 'KICK_USER', value: member.user.tag },
            { name: 'REASON', value: reason },
            { name: 'CASE_ID', value: caseObj.caseId.toString() }
        ]);

    interaction.reply({ embeds: [embed] });
    client.cases.logToModerationChannel(interaction.guildId, caseObj);
}

export const data = new SlashCommandBuilder()
    .setName('kick')
    .setNameLocalizations({ pl: 'kick' })
    .setDescription('Kick a user from the server')
    .setDescriptionLocalizations({ pl: 'Wyrzuca użytkownika z serwera' })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'użytkownik' })
            .setDescription('Provide a user to kick')
            .setDescriptionLocalizations({ pl: 'Podaj użytkownika, którego chcesz wyrzucić' })
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setNameLocalizations({ pl: 'powód' })
            .setDescription('Provide a reason for kicking this user')
            .setDescriptionLocalizations({ pl: 'Podaj powód wyrzucenia użytkownika z serwera' })
            .setMaxLength(1024)
            .setRequired(false)
    );

export const category: Category = 'moderation';
