import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import getCase from '@util/getCase';

enum CaseType {
    ban = 'Ban',
    kick = 'Wyrzucenie',
    warn = 'Warn',
    mute = 'Wyciszenie'
}

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const id = interaction.options.getInteger('id');
    const [userCase] = await getCase(client, interaction.guild, id);

    if (!userCase)
        return interaction.reply({
            content: 'Nie istnieje kara o tym ID',
            ephemeral: true
        });

    const user = client.users.cache.get(userCase.user);
    const creator = client.users.cache.get(userCase.creator);
    const embed = new Embed(client, interaction.guild.preferredLocale)
        .setTitle('Kara')
        .setThumbnail(user?.displayAvatarURL({ dynamic: true }))
        .addField('Ukarany', user?.tag || 'Nie znaleziono')
        .addField('Ukarany przez', creator?.tag || 'Nie znaleziono')
        .addField('Typ kary', CaseType[userCase.type])
        .addField('Powód', userCase.dscp)
        .setFooter(client.footer);
    interaction.reply({ embeds: [embed] });
}
export const help = {
    name: 'case',
    description: 'Sprawdź informacje o karze',
    aliases: ['kara'],
    category: 'mod'
};
