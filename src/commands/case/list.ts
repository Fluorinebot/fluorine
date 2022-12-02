import { Embed, type FluorineClient } from '#classes';
import type { ComponentData } from '#types';
import { splitArray } from '#util';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ApplicationCommandType,
    PermissionFlagsBits,
    ContextMenuCommandBuilder,
    GuildMember,
    SlashCommandSubcommandBuilder,
    type ChatInputCommandInteraction,
    type InteractionReplyOptions,
    type ButtonInteraction,
    type UserContextMenuCommandInteraction,
    type InteractionUpdateOptions
} from 'discord.js';

export async function onInteraction(
    client: FluorineClient,
    interaction:
        | ChatInputCommandInteraction<'cached'>
        | UserContextMenuCommandInteraction<'cached'>
        | ButtonInteraction,
    value: string
) {
    const [_user, _page] = value?.split('.') ?? [];
    const _member = interaction.isCommand() ? interaction.options.getMember('user') : await client.users.fetch(_user);
    const member = _member instanceof GuildMember ? _member.user : _member;
    const page = Number(_page ?? '0');

    if (!_member) {
        return interaction.reply({
            content: client.i18n.t('LISTCASE_MEMBER_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const cases = await client.cases.getMany(interaction.guildId, member);
    const chunk = splitArray(cases, 10);

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('LISTCASE_TITLE', { user: member.tag })
        .setThumbnail(member.displayAvatarURL());

    const replyOptions: InteractionReplyOptions = { embeds: [embed] };

    if (!cases.length) {
        return interaction.reply({
            content: client.i18n.t('LISTCASE_NO_CASES', {
                lng: interaction.locale,
                user: member.tag
            }),
            ephemeral: true
        });
    }

    const componentPage = page > chunk.length ? page - 1 : page;
    const chunkPage = interaction.isCommand() ? page : componentPage;

    chunk[chunkPage].forEach(caseData => {
        embed.addFields({ name: `#${caseData.caseId} ${caseData.type}`, value: caseData.reason });
    });

    if (chunk.length > 1) {
        const row = new ActionRowBuilder<ButtonBuilder>();

        row.addComponents([
            new ButtonBuilder()
                .setCustomId(`listcase:${interaction.user.id}:${member.id}.${page - 1}`)
                .setLabel(client.i18n.t('LISTCASE_BACK', { lng: interaction.locale }))
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 0),
            new ButtonBuilder()
                .setCustomId(`listcase:${interaction.user.id}:${member.id}.${page + 1}`)
                .setLabel(client.i18n.t('LISTCASE_NEXT', { lng: interaction.locale }))
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page + 1 === chunk.length)
        ]);

        replyOptions.components = [row];
    }

    interaction.isCommand()
        ? interaction.reply(replyOptions)
        : interaction.update(replyOptions as InteractionUpdateOptions);
}

export const slashCommandData = new SlashCommandSubcommandBuilder()
    .setName('list')
    .setNameLocalizations({ pl: 'lista' })
    .setDescription('Check punishments of a user')
    .setDescriptionLocalizations({ pl: 'Sprawdź kary użytkownika' })
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'użytkownik' })
            .setDescription('The user to check')
            .setDescriptionLocalizations({ pl: 'Użytkownik, którego chcesz sprawdzić' })
            .setRequired(true)
    );

export const contextMenuCommandData = new ContextMenuCommandBuilder()
    .setName('List Cases')
    .setNameLocalizations({ pl: 'Lista Kar' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
    .setDMPermission(false)
    .setType(ApplicationCommandType.User);

export const componentData: ComponentData = {
    exists: true,
    name: 'listcase',
    authorOnly: true
};
