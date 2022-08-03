import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { splitArray } from '#util/splitArr';
import { type ChatInputCommandInteraction, type RawMessageOptions } from 'tiscord';
import { ButtonStyle } from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    const member = interaction.options.getMember('user');

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
        row.addComponents([
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
                .setLabel(
                    client.i18n.t('LISTCASE_NEXT', {
                        lng: interaction.locale
                    })
                )
                .setStyle(ButtonStyle.Primary)
        ]);

        replyOptions.components = [row];
    }

    interaction.reply(replyOptions);
}

export const data = new SlashCommandSubcommandBuilder()
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
