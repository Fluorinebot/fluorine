import { Embed, type FluorineClient } from '#classes';
import { type ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getInteger('id');
    const caseObj = await client.cases.getOne(interaction.guildId, id);

    if (!caseObj) {
        return interaction.reply({
            content: client.i18n.t('CASE_NOT_FOUND', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const user = await client.users.fetch(caseObj.moderatedUser.toString());
    const creator = await client.users.fetch(caseObj.caseCreator.toString());

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CASE_TITLE', { id })
        .setThumbnail(user.displayAvatarURL())
        .addLocaleFields([
            { name: 'CASE_USER', value: user.tag },
            { name: 'CASE_MODERATOR', value: creator.tag },
            {
                name: 'CASE_TYPE',
                localeValue: caseObj.type.toUpperCase()
            },
            { name: 'CASE_REASON', value: caseObj.reason }
        ]);

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('view')
    .setNameLocalizations({ pl: 'zobacz' })
    .setDescription('Check a moderation case')
    .setDescriptionLocalizations({ pl: 'Sprawdz informacje o karze' })
    .addIntegerOption((option) =>
        option
            .setName('id')
            .setNameLocalizations({ pl: 'id' })
            .setDescription('The case ID to search')
            .setDescriptionLocalizations({ pl: 'ID kary' })
            .setMinValue(1)
            .setRequired(true)
    );
