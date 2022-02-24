import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';

export async function run(client: FluorineClient, message: Message) {
    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('SERVER_INFO')
        .addLocaleField({
            name: 'SERVER_INFO_NAME',
            value: message.guild.name
        })
        .addLocaleField({
            name: 'SERVER_INFO_CREATED',
            value: `<t:${Math.round(message.guild.createdTimestamp / 1000)}>`
        })
        .addLocaleField({
            name: 'SERVER_INFO_MEMBERS',
            value: `${message.guild?.memberCount}`
        })
        .addLocaleField({
            name: 'SERVER_INFO_CHANNELS',
            value: `${message.guild?.channels.cache.size}`
        })
        .addLocaleField({
            name: 'SERVER_INFO_ROLES',
            value: `${message.guild?.roles.cache.size}`
        });
    message.reply({ embeds: [embed] });
}
