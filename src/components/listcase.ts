import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { MessageActionRow, MessageButton, ButtonInteraction } from 'discord.js';
import getCases from '@util/getCases';

export const authorOnly = true;

export async function run(
    client: FluorineClient,
    interaction: ButtonInteraction,
    value: string
) {
    const [user, _page] = value.split('.');
    const page = parseInt(_page);

    const member = client.users.cache.get(user);
    const cases = await getCases(client, interaction.guild?.id, member.id);

    const lastPage = Math.round(cases.length / 10) + 1;

    const row = new MessageActionRow();
    row.addComponents(
        new MessageButton()
            .setCustomId(`listcase:${interaction.user.id}:${member.id}.1`)
            .setLabel(client.language.get(interaction.locale, 'LISTCASE_BACK'))
            .setStyle('PRIMARY')
            .setDisabled(page === 1)
    );

    row.addComponents(
        new MessageButton()
            .setCustomId(`listcase:${interaction.user.id}:${member.id}.2`)
            .setLabel(client.language.get(interaction.locale, 'LISTCASE_NEXT'))
            .setStyle('PRIMARY')
            .setDisabled(page === lastPage)
    );

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('LISTCASE_TITLE', { user: interaction.user.tag })
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setFooter({
            text: `${client.language.get(
                interaction.locale,
                'LISTCASE_FOOTER'
            )} | ${client.footer}`
        });

    const chunk = 10;
    let currChunkItem = 0;
    for (let i = 0, j = cases.length; i < j; i += chunk) {
        const temporary = cases.slice(i, i + chunk);
        const caseData = temporary[currChunkItem];
        embed.addField(`#${caseData.id} ${caseData.type}`, caseData.dscp);
        currChunkItem++;
    }

    interaction.update({ embeds: [embed], components: [row] });
}
