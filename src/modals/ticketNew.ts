import { type FluorineClient, Embed } from '#classes';
import {
    ActionRowBuilder,
    ButtonBuilder,
    type MessageActionRowComponentBuilder,
    type Collection,
    type ModalSubmitInteraction,
    type TextInputComponent,
    ButtonStyle
} from 'discord.js';

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
                .setTitle(fields.get('creationPointTitle').value)
                .setDescription(fields.get('creationPointContent')?.value ?? 'none')
        ],
        components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`ticketPoint:${interaction.user.id}`)
                    .setLabel('Create Ticket')
            )
        ]
    });

    interaction.reply({ content: 'That is copied, mantain flight level MOM.' });
}
