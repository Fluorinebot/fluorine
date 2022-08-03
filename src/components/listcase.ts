import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { splitArray } from '#util/splitArr';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { type ButtonInteraction } from 'tiscord';

export const authorOnly = true;

export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    const [user, _page] = value.split('.');
    const page = Number(_page);
    const member = await client.users.get(user);
    const cases = await client.cases.getMany(interaction.guildId, member);

    const chunk = splitArray(cases, 10);

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

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('LISTCASE_TITLE', { user: member.tag })
        .setThumbnail(`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png`);

    chunk[page > chunk.length ? page - 1 : page].forEach(caseData => {
        embed.addFields({ name: `#${caseData.caseId} ${caseData.type}`, value: caseData.reason });
    });

    interaction.editOriginalMessage({ embeds: [embed.toJSON()], components: [row] });
}
