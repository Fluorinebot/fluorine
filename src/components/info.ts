import type { FluorineClient } from '#classes';
import { getInfoEmbed, getInfoComponents } from '#util';
import type { ButtonInteraction } from 'discord.js';

export const authorOnly = true;
export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    interaction.update({
        embeds: [await getInfoEmbed(client, interaction, value as 'info' | 'stats')],
        components: [getInfoComponents(client, interaction, value as 'info' | 'stats')]
    });
}
