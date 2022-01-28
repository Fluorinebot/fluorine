import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import {
    CommandInteraction,
    MessageActionRow,
    MessageButton
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';
import getCases from '@util/getCases';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction<'cached'>
) {
    const row = new MessageActionRow();
    const member = interaction.options.getMember('user');

    const cases = await getCases(client, interaction.guild?.id, member.user.id);
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('LISTCASE_TITLE', { user: member.user.tag })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
            text: `${client.language.get(
                interaction.locale,
                'LISTCASE_FOOTER'
            )} | ${client.footer}`
        });

    const chunk = cases.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 9);

        if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);

    chunk[0].forEach(caseData => {
        embed.addField(`#${caseData.id} ${caseData.type}`, caseData.dscp);
    });

    row.addComponents(
        new MessageButton()
            .setCustomId(`listcase:${interaction.user.id}:${member.user.id}.1`)
            .setLabel(client.language.get(interaction.locale, 'LISTCASE_BACK'))
            .setStyle('PRIMARY')
            .setDisabled(true)
    );

    row.addComponents(
        new MessageButton()
            .setCustomId(`listcase:${interaction.user.id}:${member.user.id}.2`)
            .setLabel(client.language.get(interaction.locale, 'LISTCASE_NEXT'))
            .setStyle('PRIMARY')
    );

    interaction.reply({ embeds: [embed], components: [row] });
}

export const data = new SlashCommandBuilder()
    .setName('listcase')
    .setDescription('Check punishments of a user')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('The user to check')
            .setRequired(true)
    );

export const category: Category = 'tools';
export const dev = true;
