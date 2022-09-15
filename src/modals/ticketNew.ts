import { type FluorineClient, Embed } from '#classes';
import type { Collection, ModalSubmitInteraction, TextInputComponent } from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: ModalSubmitInteraction,
    fields: Collection<string, TextInputComponent>
) {
    return interaction.reply({
        embeds: [
            new Embed(client, interaction.locale)
                .setTitle(fields.get('ticketTitle').value)
                .setDescription(fields.get('ticketContent')?.value ?? 'none')
        ]
    });
}
