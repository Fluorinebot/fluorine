import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { getInfoComponents, getInfoEmbed } from '#util';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    interaction.reply({
        embeds: [await getInfoEmbed(client, interaction, 'info')],
        components: [getInfoComponents(client, interaction, 'info')]
    });
}

export const data = new SlashCommandBuilder()
    .setName('info')
    .setNameLocalizations({ pl: 'informacje' })
    .setDescription('Information about Fluorine')
    .setDescriptionLocalizations({ pl: 'Informacje o Fluorine' });

export const category: Category = 'tools';
