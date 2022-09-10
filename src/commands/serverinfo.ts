import { Embed, type FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const embed = new Embed(client, interaction.locale).setLocaleTitle('SERVER_INFO').addLocaleFields([
        {
            name: 'SERVER_INFO_NAME',
            value: interaction.guild.name
        },
        {
            name: 'SERVER_INFO_CREATED',
            value: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}>`
        },
        {
            name: 'SERVER_INFO_MEMBERS',
            value: `${interaction.guild.memberCount}`
        },
        {
            name: 'SERVER_INFO_CHANNELS',
            value: `${interaction.guild.channels.cache.size}`
        },
        {
            name: 'SERVER_INFO_ROLES',
            value: `${interaction.guild.roles.cache.size}`
        }
    ]);
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('serverinfo')
    .setNameLocalizations({ pl: 'serverinfo' })
    .setDescription('Information about this server')
    .setDescriptionLocalizations({ pl: 'Informacje o tym serwerze' })
    .setDMPermission(false);

export const category: Category = 'tools';
