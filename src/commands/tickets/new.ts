import type { FluorineClient } from '#classes';
import {
    type ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle
} from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
        .setTitle('Create New Ticket')
        .setCustomId('modal:ticketNew')
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
                    .setRequired(false)
            )
        );

    interaction.showModal(modal);
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('new')
    .setNameLocalizations({ pl: 'idk-either-but-this' })
    .setDescription('idk smth abt creating a new user-facing ticket creation point or bullidk')
    .setDescriptionLocalizations({ pl: 'do ur mom' });
