import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandSubcommandBuilder,
    ContextMenuCommandBuilder
} from '#builders';
import type { FluorineClient } from '#classes';
import type { ComponentData } from '#types';
import { splitArray } from '#util';
import {
    ApplicationCommandType,
    type ButtonInteraction,
    ButtonStyle,
    type CommandInteraction,
    type GuildMember,
    type InteractionReplyOptions,
    type InteractionUpdateOptions,
    PermissionFlagsBits
} from 'discord.js';

export async function onInteraction(
    client: FluorineClient,
    interaction: ButtonInteraction | CommandInteraction<'cached'>,
    value: string
) {
    const [user, _page] = value?.split('.') ?? [];
    const page = Number(_page ?? '0');

    const member: GuildMember = interaction.isCommand()
        ? interaction.options.getMember('user')
        : await interaction.guild.members.fetch(user).catch(() => null);

    if (!member) {
        return interaction.reply({
            content: client.i18n.t('LISTCASE_MEMBER_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const cases = await client.cases.getMany(interaction.guildId, member.user);
    const chunk = splitArray(cases, 10);

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('LISTCASE_TITLE', { user: member.user.tag })
        .setThumbnail(member.displayAvatarURL());

    const replyOptions: InteractionReplyOptions & InteractionUpdateOptions = { embeds: [embed] };

    if (!cases.length) {
        return interaction.reply({
            content: client.i18n.t('LISTCASE_NO_CASES', {
                lng: interaction.locale,
                user: member.user.tag
            }),
            ephemeral: true
        });
    }

    const componentPage = page > chunk.length ? page - 1 : page;
    const chunkPage = interaction.isCommand() ? page : componentPage;

    chunk[chunkPage].forEach(caseData => {
        embed.addFields([{ rawName: `#${caseData.caseId} ${caseData.type}`, rawValue: caseData.reason }]);
    });

    if (chunk.length > 1) {
        const row = new ActionRowBuilder(interaction.locale).addComponents([
            new ButtonBuilder(`listcase:${interaction.user.id}:${member.id}.${page - 1}`)
                .setLabel('LISTCASE_BACK')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 0),
            new ButtonBuilder(`listcase:${interaction.user.id}:${member.id}.${page + 1}`)
                .setLabel('LISTCASE_NEXT')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page + 1 === chunk.length)
        ]);

        replyOptions.components = [row];
    }

    interaction.isCommand() ? interaction.reply(replyOptions) : interaction.update(replyOptions);
}

export const slashCommandData = new SlashCommandSubcommandBuilder('LIST').addUserOption('USER', option =>
    option.setRequired(true)
);

export const contextMenuCommandData = new ContextMenuCommandBuilder(ApplicationCommandType.User, 'CASE.LIST')
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
    .setDMPermission(false);

export const componentData: ComponentData = {
    exists: true,
    name: 'listcase',
    authorOnly: true
};
