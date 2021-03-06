import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Category } from '#types/structures';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction<'cached'>) {
    const member = interaction.options.getMember('user');
    const reason =
        interaction.options.getString('reason') ??
        client.i18n.t('NONE', {
            lng: interaction.locale
        });

    if (!member) {
        return interaction.reply({
            content: client.i18n.t('BAN_MEMBER_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (member.user.id === interaction.user.id) {
        return interaction.reply({
            content: client.i18n.t('BAN_ERROR_YOURSELF', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (!member.bannable) {
        return interaction.reply({
            content: client.i18n.t('BAN_BOT_PERMISSIONS_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const caseObj = await client.cases.create(interaction.guildId, member.user, interaction.user, 'ban', reason);

    await member.ban({
        reason: client.i18n.t('BAN_REASON', {
            lng: interaction.locale,
            user: interaction.user.tag,
            reason
        })
    });

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('BAN_SUCCESS_TITLE')
        .setLocaleDescription('BAN_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL())
        .addLocaleFields([
            { name: 'BAN_MODERATOR', value: interaction.user.tag },
            { name: 'BAN_USER', value: member.user.tag },
            { name: 'REASON', value: reason },
            { name: 'CASE_ID', value: caseObj.caseId.toString() }
        ]);

    interaction.reply({ embeds: [embed] });
    client.cases.logToModerationChannel(interaction.guildId, caseObj);
}

export const data = new SlashCommandBuilder()
    .setName('ban')
    .setNameLocalizations({ pl: 'ban' })
    .setDescription('Ban a user from the server')
    .setDescriptionLocalizations({ pl: 'Zbanuj u??ytkownika' })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'u??ytkownik' })
            .setDescription('Provide a user to ban')
            .setDescriptionLocalizations({ pl: 'Podaj u??ytkownika, kt??rego chcesz zbanowa??' })
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setNameLocalizations({ pl: 'pow??d' })
            .setDescription('Provide a reason for banning this user')
            .setDescriptionLocalizations({ pl: 'Podaj pow??d bana' })
            .setMaxLength(1024)
            .setRequired(false)
    );

export const category: Category = 'moderation';
