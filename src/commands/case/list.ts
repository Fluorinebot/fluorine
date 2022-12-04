import { Embed, type FluorineClient } from '#classes';
import { splitArray } from '#util';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    type ChatInputCommandInteraction,
    type InteractionReplyOptions,
    SlashCommandSubcommandBuilder
} from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction<'cached'>) {
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
        .setThumbnail(member.user.displayAvatarURL());

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

    chunk[0].forEach((caseData) => {
        embed.addFields({ name: `#${caseData.caseId} ${caseData.type}`, value: caseData.reason });
    });

    const replyOptions: InteractionReplyOptions = { embeds: [embed] };

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
    .addUserOption((option) =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'użytkownik' })
            .setDescription('The user to check')
            .setDescriptionLocalizations({ pl: 'Użytkownik, którego chcesz sprawdzić' })
            .setRequired(true)
    );
