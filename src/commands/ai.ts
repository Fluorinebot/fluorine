import type FluorineClient from '#classes/Client';
import type { Category } from '#types/structures';
import { SlashCommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'tiscord';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const args = interaction.options.getString('start');

    if (client.ai.queue.some(q => q.interaction.user.id === interaction.user.id)) {
        return interaction.reply({
            content: client.i18n.t('AI_LIMIT', { lng: interaction.locale }),
            ephemeral: true
        });
    }

    await interaction.defer();
    client.ai.getAI(interaction, args);
}

export const data = new SlashCommandBuilder()
    .setName('ai')
    .setNameLocalizations({ pl: 'ai' })
    .setDescription('Make AI complete your sentence')
    .setDescriptionLocalizations({ pl: 'AI dokończy twoje zdanie' })
    .addStringOption(option =>
        option
            .setName('start')
            .setNameLocalizations({ pl: 'start' })
            .setDescription('Start of the sentence')
            .setDescriptionLocalizations({ pl: 'Początek zdania' })
            .setMaxLength(65)
            .setRequired(true)
    );

export const category: Category = 'fun';
