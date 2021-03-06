import FluorineClient from '#classes/Client';
import { getComponents, getEmbed } from '#util/info';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Category } from '#types/structures';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    interaction.reply({
        embeds: [await getEmbed(client, interaction, 'info')],
        components: [getComponents(client, interaction, 'info')]
    });
}

export const data = new SlashCommandBuilder()
    .setName('info')
    .setNameLocalizations({ pl: 'informacje' })
    .setDescription('Information about Fluorine')
    .setDescriptionLocalizations({ pl: 'Informacje o Fluorine' });

export const category: Category = 'tools';
