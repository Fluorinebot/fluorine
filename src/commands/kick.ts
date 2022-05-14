import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { Category } from 'types/structures';

export async function run(client: FluorineClient, interaction: CommandInteraction<'cached'>) {
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

    if (reason.length > 1024) {
        return interaction.reply({
            content: client.i18n.t('REASON_LONGER_THAN_1024', {
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
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'KICK_MODERATOR', value: interaction.user.tag })
        .addLocaleField({ name: 'KICK_USER', value: member.user.tag })
        .addLocaleField({ name: 'REASON', value: reason })
        .addLocaleField({ name: 'CASE_ID', value: caseObj.case_id.toString() });

    interaction.reply({ embeds: [embed] });
    client.cases.logToModerationChannel(interaction.guildId, caseObj);
}

export const data = new SlashCommandBuilder()
    .setName('kick')
    .setNameLocalizations({ pl: 'kick' })
    .setDescription('Kick a user from the server')
    .setDescriptionLocalizations({ pl: 'Wyrzuca użytkownika z serwera' })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers as any)
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
            .setRequired(false)
    );

export const category: Category = 'moderation';
