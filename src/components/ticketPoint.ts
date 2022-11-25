import type { FluorineClient } from '#classes';
import { ActionRowBuilder, type ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const authorOnly = false;

export async function run(client: FluorineClient, interaction: ButtonInteraction) {
    const modal = new ModalBuilder()
        .setTitle('Create New Ticket')
        .setCustomId(`createTicket:${interaction.user.id}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId(`ticketTitle`)
                    .setLabel('Ticket Title')
                    .setPlaceholder('A short title that describes the ticket.')
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(256)
                    .setRequired(true)
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId(`ticketContent`)
                    .setLabel('Ticket Description')
                    .setPlaceholder('A more indepth description of the ticket.')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(4000)
                    .setRequired(true)
            )
        );

    interaction.showModal(modal);
}
