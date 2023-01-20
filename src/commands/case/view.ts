import { SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
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

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('CASE_TITLE', { id })
        .setThumbnail(user.displayAvatarURL())
        .addFields([
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

export const slashCommandData = new SlashCommandSubcommandBuilder('VIEW').addIntegerOption('ID', option =>
    option.setMinValue(1).setRequired(true)
);
