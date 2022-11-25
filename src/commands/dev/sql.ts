import { type FluorineClient } from '#classes';
import {
    type ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
        .setTitle('Evaluate')
        .setCustomId(`sql:${interaction.user.id}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId(`code`)
                    .setLabel('Statement')
                    .setPlaceholder('DROP DATABASE;')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(4000)
                    .setRequired(true)
            )
        );

    interaction.showModal(modal);
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('sql')
    .setDescription("Robert'); DROP TABLE students;--");
