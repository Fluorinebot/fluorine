import { type FluorineClient, Embed } from '#classes';
import {
    ChannelType,
    CategoryChannel,
    type Collection,
    type ModalSubmitInteraction,
    type TextInputComponent
} from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: ModalSubmitInteraction,
    fields: Collection<string, TextInputComponent>,
    value: string
) {
    interaction.deferReply({ ephemeral: true });

    const { ticketCategory: ticketCategoryId, ticketStaff: ticketStaffId } = await client.prisma.config.findUnique({
        where: {
            guildId: BigInt(interaction.guildId)
        },
        select: {
            ticketStaff: true,
            ticketCategory: true
        }
    });

    const user = await interaction.guild.members.fetch(value);
    const category = await interaction.guild.channels.fetch(ticketCategoryId.toString());

    if (category instanceof CategoryChannel) {
        const channel = await category.children.create<ChannelType.GuildText>({
            name: `ticket-${user.toString()}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                { id: ticketStaffId.toString(), allow: ['ViewChannel', 'SendMessages'] },
                { id: user.id, allow: ['ViewChannel', 'SendMessages'] },
                { id: interaction.guildId, deny: ['ViewChannel', 'SendMessages'] }
            ]
        });

        channel.send({
            content: 'To close this ticket, use `/ticket close`. To add users, use `/ticket add`',
            embeds: [
                new Embed(client, interaction.locale)
                    .setTitle(fields.get('ticketTitle').value)
                    .setDescription(fields.get('ticketContent')?.value ?? 'none')
            ]
        });

        interaction.editReply({ content: `Ticket created! <#${channel.id}>` });
    }
}
