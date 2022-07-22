import FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { splitArray } from '#util/splitArr';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';

export const authorOnly = true;

export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    const [user, _page] = value.split('.');
    const page = Number(_page);
    const member = client.users.cache.get(user);
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
        .setThumbnail(member.displayAvatarURL());

    chunk[page > chunk.length ? page - 1 : page].forEach(caseData => {
        embed.addFields({ name: `#${caseData.caseId} ${caseData.type}`, value: caseData.reason });
    });

    interaction.update({ embeds: [embed], components: [row] });
}
