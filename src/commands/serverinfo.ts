import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import type { Category } from '#types/structures';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { GuildChannel, Cache, Role, ChatInputCommandInteraction } from 'tiscord';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const embed = new Embed(client, interaction.locale).setLocaleTitle('SERVER_INFO').addLocaleFields([
        {
            name: 'SERVER_INFO_NAME',
            value: interaction.guild.name
        },
        {
            name: 'SERVER_INFO_MEMBERS',
            value: `${interaction.guild.memberCount}`
        },
        {
            name: 'SERVER_INFO_CHANNELS',
            value: `${
                [...client.cache.channels.values()].filter((c: GuildChannel) => c.guildId === interaction.guild.id)
                    .length
            }`
        },
        {
            name: 'SERVER_INFO_ROLES',
            value: `${(client.cache.roles as Cache<Role>).caches.get(interaction.guild.id)?.size ?? 0}`
        }
    ]);
    interaction.reply({ embeds: [embed.toJSON()] });
}

export const data = new SlashCommandBuilder()
    .setName('serverinfo')
    .setNameLocalizations({ pl: 'serverinfo' })
    .setDescription('Information about this server')
    .setDescriptionLocalizations({ pl: 'Informacje o tym serwerze' })
    .setDMPermission(false);

export const category: Category = 'tools';
