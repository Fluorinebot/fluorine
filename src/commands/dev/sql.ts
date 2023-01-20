import { EmbedBuilder, SlashCommandSubcommandBuilder } from '#builders';
import { type FluorineClient } from '#classes';
import {
    type Collection,
    type ModalSubmitInteraction,
    type TextInputComponent,
    type ChatInputCommandInteraction,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    codeBlock
} from 'discord.js';
import { clean } from '#util';
import type { NonCommandInteractionData } from '#types';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
        .setTitle('Evaluate')
        .setCustomId(`sql:${interaction.user.id}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId(`code`)
                    .setLabel('Statement')
                    .setPlaceholder('DROP MY_SPLENDID_DATABASE;')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(4000)
                    .setRequired(true)
            )
        );

    interaction.showModal(modal);
}

export async function onModal(
    client: FluorineClient,
    interaction: ModalSubmitInteraction,
    fields: Collection<string, TextInputComponent>
) {
    const code = fields.get('code').value;
    code.replace('```sql\n', '').replace('\n```', '');
    const embed = new EmbedBuilder(client, interaction.locale);

    try {
        const evaluated = client.prisma.$queryRawUnsafe(code);
        const cleaned = await clean(client, evaluated);

        embed.setTitle('Done').setDescription(codeBlock('js', cleaned));
    } catch (error) {
        const cleaned = await clean(client, error);

        embed.setTitle('Failed').setDescription(codeBlock('js', cleaned));
    }

    interaction.reply({ embeds: [embed.builder] });
}

export const modalData: NonCommandInteractionData = {
    exists: true,
    name: 'sql'
};

export const slashCommandData = new SlashCommandSubcommandBuilder('SQL');
