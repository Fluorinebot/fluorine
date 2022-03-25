import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import getCase from '@util/getCase';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const id = interaction.options.getInteger('id');
    const [userCase] = await getCase(client, interaction.guild, id);

    if (!userCase) {
        return interaction.reply({
            content: client.i18n.t('CASE_NOT_FOUND', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const user = await client.users.fetch(userCase.user);
    const creator = await client.users.fetch(userCase.creator);

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CASE_TITLE', { id })
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'CASE_USER', value: user.tag })
        .addLocaleField({ name: 'CASE_MODERATOR', value: creator.tag })
        .addLocaleField({
            name: 'CASE_TYPE',
            localeValue: userCase.type.toUpperCase()
        })
        .addLocaleField({ name: 'CASE_REASON', value: userCase.dscp });

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('case')
    .setDescription('Check a moderation case')
    .addIntegerOption(option =>
        option.setName('id').setDescription('The case ID to search').setMinValue(1).setRequired(true)
    );

export const category: Category = 'moderation';
