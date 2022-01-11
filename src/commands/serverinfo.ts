import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { ChatInputCommandInteraction } from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction
) {
    const embed = new Embed(client, interaction.guild.preferredLocale)
        .setLocaleTitle('SERVER_INFO')
        .addLocaleField({
            name: 'SERVER_INFO_NAME',
            value: interaction.guild.name
        })
        .addLocaleField({
            name: 'SERVER_INFO_CREATED',
            value: `<t:${Math.round(
                interaction.guild.createdTimestamp / 1000
            )}>`
        })
        .addLocaleField({
            name: 'SERVER_INFO_MEMBERS',
            value: `${interaction.guild?.memberCount}`
        })
        .addLocaleField({
            name: 'SERVER_INFO_CHANNELS',
            value: `${interaction.guild?.channels.cache.size}`
        })
        .addLocaleField({
            name: 'SERVER_INFO_ROLES',
            value: `${interaction.guild?.roles.cache.size}`
        });
    interaction.reply({ embeds: [embed] });
}
export const help = {
    name: 'serverinfo',
    description: 'Informacje o serwerze',
    aliases: ['server', 'si'],
    category: 'tools'
};
