import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import {
    CommandInteraction,
    MessageActionRow,
    MessageSelectMenu
} from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const row = new MessageActionRow().addComponents([
        new MessageSelectMenu()
            .setCustomId(`help:${interaction.user.id}`)
            .setOptions([
                {
                    label: 'Home',
                    value: 'home',
                    emoji: '🏠',
                    default: true
                },
                {
                    label: 'Fun',
                    value: 'fun',
                    emoji: '🎮'
                },
                {
                    label: 'Narzędzia',
                    value: 'tools',
                    emoji: '🛠️'
                },
                {
                    label: 'Moderacja',
                    value: 'moderation',
                    emoji: '🔨'
                }
            ])
    ]);

    const embed = new Embed().setTitle('Help').setDescription('select');

    interaction.reply({
        embeds: [embed],
        components: [row]
    });
}

export const help = {
    name: 'help',
    description: 'Lista komend',
    aliases: ['pomoc', 'h'],
    category: 'tools'
};
