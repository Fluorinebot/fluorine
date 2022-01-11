import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { ChatInputCommandInteraction } from 'discord.js';
import getCase from '@util/getCase';

export async function run(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction
) {
    const id = interaction.options.getInteger('id');
    const [userCase] = await getCase(client, interaction.guild, id);

    if (!userCase)
        return interaction.reply({
            content: client.language.get(interaction.locale, 'CASE_NOT_FOUND'),
            ephemeral: true
        });

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
export const help = {
    name: 'case',
    description: 'Sprawdź informacje o karze',
    aliases: ['kara'],
    category: 'mod'
};
