import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import ms, { StringValue } from 'ms';
import { Category } from '#types/structures';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction<'cached'>) {
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

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('TIMEOUT_SUCCESS_TITLE')
        .setLocaleDescription('TIMEOUT_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL())
        .addLocaleFields([
            {
                name: 'TIMEOUT_MODERATOR',
                value: interaction.user.tag
            },
            { name: 'TIMEOUT_USER', value: member.user.tag },
            { name: 'DURATION', value: ms(duration) },
            { name: 'REASON', value: reason },
            { name: 'CASE_ID', value: caseObj.caseId.toString() }
        ]);

    interaction.reply({ embeds: [embed] });
    client.cases.logToModerationChannel(interaction.guildId, caseObj);
}

export const data = new SlashCommandBuilder()
    .setName('timeout')
    .setNameLocalizations({ pl: 'timeout' })
    .setDescription('Timeout a user from the server')
    .setDescriptionLocalizations({ pl: 'Wy??lij u??ytkownika na przerw?? (podobne do mute)' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'u??ytkownik' })
            .setDescription('Provide a user to timeout')
            .setDescriptionLocalizations({ pl: 'Podaj u??ytkownika, kt??rego chcesz wys??a?? na przerw??' })
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('duration')
            .setNameLocalizations({ pl: 'd??ugo????' })
            .setDescription('Provide how long the timeout will last')
            .setDescriptionLocalizations({ pl: 'Podaj, jak d??ugo ma trwa?? przerwa' })
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setNameLocalizations({ pl: 'pow??d' })
            .setDescription('Provide a reason for timing out this user')
            .setDescriptionLocalizations({ pl: 'Podaj pow??d przerwy' })
            .setMaxLength(1024)
            .setRequired(false)
    );

export const category: Category = 'moderation';
