import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message, MessageActionRow, MessageSelectMenu } from 'discord.js';

export async function run(client: FluorineClient, message: Message) {
    const embed = new Embed(client, message.guild.preferredLocale)
        .setTitle('Help')
        .setDescription('Select a category');
    const row = new MessageActionRow().addComponents([
        new MessageSelectMenu()
            .setCustomId(`help:${message.author.id}`)
            .setOptions([
                {
                    label: client.language.get(
                        message.guild.preferredLocale,
                        'FUN'
                    ),
                    value: 'fun',
                    emoji: '🎮'
                },
                {
                    label: client.language.get(
                        message.guild.preferredLocale,
                        'TOOLS'
                    ),
                    value: 'tools',
                    emoji: '🛠️'
                },
                {
                    label: client.language.get(
                        message.guild.preferredLocale,
                        'MODERATION'
                    ),
                    value: 'moderation',
                    emoji: '🔨'
                }
            ])
    ]);

    message.channel.send({
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
