import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { splitArray } from '#util/splitArr';
import { ActionRowBuilder, ButtonBuilder, ContextMenuCommandBuilder } from '@discordjs/builders';
import { ButtonStyle, PermissionFlagsBits, ApplicationCommandType } from 'discord-api-types/v10';
import { type RawMessageOptions, type UserContextMenuInteraction } from 'tiscord';

export async function run(client: FluorineClient, interaction: UserContextMenuInteraction) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    const user = interaction.target;
    const member = await interaction.guild.members.get(user.id);
    if (!member) {
        return interaction.reply({
            content: client.i18n.t('LISTCASE_MEMBER_MISSING', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const cases = await client.cases.getMany(interaction.guildId, member.user);

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('LISTCASE_TITLE', { user: member.user.tag })
        .setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`);

    if (!cases.length) {
        return interaction.reply({
            content: client.i18n.t('LISTCASE_NO_CASES', {
                lng: interaction.locale,
                user: member.user.tag
            }),
            ephemeral: true
        });
    }

    const chunk = splitArray(cases, 10);

    chunk[0].forEach(caseData => {
        embed.addFields({ name: `#${caseData.caseId} ${caseData.type}`, value: caseData.reason });
    });

    const replyOptions: RawMessageOptions = { embeds: [embed.toJSON()] };

    if (chunk.length > 1) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`listcase:${interaction.user.id}:${member.user.id}.0`)
                .setLabel(
                    client.i18n.t('LISTCASE_BACK', {
                        lng: interaction.locale
                    })
                )
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId(`listcase:${interaction.user.id}:${member.user.id}.1`)
                .setLabel(client.i18n.t('LISTCASE_NEXT', { lng: interaction.locale }))
                .setStyle(ButtonStyle.Primary)
        );

        replyOptions.components = [row];
    }

    interaction.reply(replyOptions);
}

export const data = new ContextMenuCommandBuilder()
    .setName('List Cases')
    .setNameLocalizations({ pl: 'Lista Kar' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
    .setDMPermission(false)
    .setType(ApplicationCommandType.User);
