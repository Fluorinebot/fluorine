import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
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

    const user = await client.users.fetch(caseObj.moderated_user.toString());
    const creator = await client.users.fetch(caseObj.case_creator.toString());

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CASE_TITLE', { id })
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'CASE_USER', value: user.tag })
        .addLocaleField({ name: 'CASE_MODERATOR', value: creator.tag })
        .addLocaleField({
            name: 'CASE_TYPE',
            localeValue: caseObj.type.toUpperCase()
        })
        .addLocaleField({ name: 'CASE_REASON', value: caseObj.reason });

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('case')
    .setNameLocalizations({ pl: 'kara' })
    .setDescription('Check a moderation case')
    .setDescriptionLocalizations({ pl: 'Sprawdz informacje o karze' })
    .addIntegerOption(option =>
        option
            .setName('id')
            .setNameLocalizations({ pl: 'id' })
            .setDescription('The case ID to search')
            .setDescriptionLocalizations({ pl: 'ID kary' })
            .setMinValue(1)
            .setRequired(true)
    );

export const category: Category = 'moderation';
