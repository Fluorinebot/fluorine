import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { getInfoComponents, getInfoEmbed } from '#util';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    interaction.reply({
        embeds: [await getInfoEmbed(client, interaction, 'info')],
        components: [getInfoComponents(client, interaction, 'info')]
    });
}

export const slashCommandData = new SlashCommandBuilder()
    .setName('info')
    .setNameLocalizations({ pl: 'informacje' })
    .setDescription('Information about Fluorine')
    .setDescriptionLocalizations({ pl: 'Informacje o Fluorine' });

export const category: Category = 'tools';
