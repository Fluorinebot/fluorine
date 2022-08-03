import type FluorineClient from '#classes/Client';
import { getEmbed, getComponents } from '#util/info';
import type { ButtonInteraction } from 'tiscord';

export const authorOnly = true;
export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    interaction.editOriginalMessage({
        embeds: [await getEmbed(client, interaction, value as 'info' | 'stats')],
        components: [getComponents(client, interaction, value as 'info' | 'stats')]
    });
}
