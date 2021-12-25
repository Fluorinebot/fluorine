import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction<'cached'>
) {
    const member = interaction.options.getMember('user') ?? interaction.member;

    const embed = new Embed(client, interaction.guild.preferredLocale)
        .setLocaleTitle('AVATAR')
        .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));
    interaction.reply({ embeds: [embed] });
}
export const help = {
    name: 'avatar',
    description: 'Pokaż avatar wybranego użytkownika',
    aliases: ['av'],
    category: 'tools'
};
