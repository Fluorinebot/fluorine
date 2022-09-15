import { type FluorineClient, Embed } from '#classes';
import type { Collection, ModalSubmitInteraction, TextInputComponent } from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: ModalSubmitInteraction,
    fields: Collection<string, TextInputComponent>,
    value: string
) {
    interaction.deferReply({ ephemeral: true });
    const channel = interaction.guild.channels.cache.get(value);

    if (!channel?.isTextBased()) {
        return;
    }

    channel.send({
        embeds: [
            new Embed(client, interaction.locale)
                .setTitle(fields.get('ticketTitle').value)
                .setDescription(fields.get('ticketContent')?.value ?? 'none')
        ]
    });

    interaction.editReply({ content: 'hi' });
}
