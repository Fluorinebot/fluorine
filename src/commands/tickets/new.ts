import type { FluorineClient } from '#classes';
import {
    type ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle,
    ChannelType
} from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
        .setTitle('Create Ticket Waypoint')
        .setCustomId(`ticketNew:${interaction.options.getChannel('channel').id}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId(`ticketTitle`)
                    .setLabel('Creation Point Title')
                    .setPlaceholder('A short title that describes the purpose of the creation point.')
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

export const data = new SlashCommandSubcommandBuilder()
    .setName('new')
    .setNameLocalizations({ pl: 'new_pl' })
    .setDescription('Make a new ticket creation point to allow users to create tickets')
    .setDescriptionLocalizations({ pl: 'new_desc_pl' })
    .addChannelOption(option =>
        option
            .setName('channel')
            .setNameLocalizations({ pl: 'kanał' })
            .setDescription('The channel to post the new ticket waypoint in.')
            .setDescriptionLocalizations({ pl: 'channel_desc_pl' })
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
    );
