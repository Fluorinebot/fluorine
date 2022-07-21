import FluorineClient from '@classes/Client';
import { getEmbed, getComponents } from '@util/info';
import { ButtonInteraction } from 'discord.js';

export const authorOnly = true;
export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    interaction.update({
        embeds: [await getEmbed(client, interaction, value as 'info' | 'stats')],
        components: [getComponents(client, interaction, value as 'info' | 'stats')]
    });
}
