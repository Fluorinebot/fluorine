import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { InteractionReplyOptions, MessageActionRow, MessageButton, UserContextMenuInteraction } from 'discord.js';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v9';
import { splitArray } from '@util/splitArr';
import { Case } from 'types/databaseTables';

export async function run(client: FluorineClient, interaction: UserContextMenuInteraction<'cached'>) {
    const row = new MessageActionRow();
    const member = interaction.targetMember;

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
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

    if (!cases.length) {
        return interaction.reply({
            content: client.i18n.t('LISTCASE_NO_CASES', {
                lng: interaction.locale,
                user: member.user.tag
            }),
            ephemeral: true
        });
    }

    const chunk = splitArray<Case>(cases, 10);

    chunk[0].forEach(caseData => {
        embed.addField(`#${caseData.case_id} ${caseData.type}`, caseData.reason);
    });

    const replyOptions: InteractionReplyOptions = { embeds: [embed] };

    if (chunk.length > 1) {
        row.addComponents(
            new MessageButton()
                .setCustomId(`listcase:${interaction.user.id}:${member.user.id}.0`)
                .setLabel(
                    client.i18n.t('LISTCASE_BACK', {
                        lng: interaction.locale
                    })
                )
                .setStyle('PRIMARY')
                .setDisabled(true)
        );

        row.addComponents(
            new MessageButton()
                .setCustomId(`listcase:${interaction.user.id}:${member.user.id}.1`)
                .setLabel(client.i18n.t('LISTCASE_NEXT', { lng: interaction.locale }))
                .setStyle('PRIMARY')
        );

        replyOptions.components = [row];
    }

    interaction.reply(replyOptions);
}

export const data = new ContextMenuCommandBuilder().setName('List Cases').setType(ApplicationCommandType.User);
