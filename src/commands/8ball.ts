import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const question = interaction.options.getString('question');
    const responses = [
        'Tak',
        'Nie',
        'Możliwe',
        'Prawdopodobnie',
        'Nie jestem pewien',
        'Wątpię'
    ];

    const embed = new Embed(client, interaction.guild.preferredLocale)
        .setDescription(question)
        .setFooter(client.footer)
        .addField(
            'Odpowiedź',
            responses[Math.floor(Math.random() * responses.length)]
        );
    interaction.reply({ embeds: [embed] });
}
export const help = {
    name: '8ball',
    description: 'Magiczna kula',
    aliases: [],
    category: 'fun'
};
