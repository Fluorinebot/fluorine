import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message, MessageActionRow, MessageSelectMenu } from 'discord.js';

export async function run(client: FluorineClient, message: Message) {
    const embed = new Embed(client, message.guild.preferredLocale).setTitle('Help').setDescription('Select a category');
    const row = new MessageActionRow().addComponents([
        new MessageSelectMenu().setCustomId(`help:${message.author.id}`).setOptions([
            {
                label: client.i18n.t('FUN', {
                    lng: message.guild.preferredLocale
                }),
                value: 'fun',
                emoji: '🎮'
            },
            {
                label: client.i18n.t('TOOLS', {
                    lng: message.guild.preferredLocale
                }),
                value: 'tools',
                emoji: '🛠️'
            },
            {
                label: client.i18n.t('MODERATION', {
                    lng: message.guild.preferredLocale
                }),
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
