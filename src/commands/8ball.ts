import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';
import hash from 'murmurhash-v3';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString('question');
    const responseId = hash(question) % 6;

    const embed = new EmbedBuilder(client, interaction.locale).setDescription(question).addFields({
        name: '8BALL_RESPONSE',
        value: `8BALL_RESPONSES.${responseId}`
    });

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('8BALL').addStringOption('QUESTION', option =>
    option.setRequired(true)
);

export const category: Category = 'fun';
