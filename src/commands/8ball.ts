import { SlashCommandBuilder } from '#builders';
import { Embed, type FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';
import hash from 'murmurhash-v3';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString('question');
    const responseId = hash(question) % 6;

    const embed = new Embed(client, interaction.locale).setDescription(question).addLocaleFields([
        {
            name: '8BALL_RESPONSE',
            localeValue: `8BALL_RESPONSES.${responseId}`
        }
    ]);

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('8BALL').addStringOption('QUESTION', option =>
    option.setRequired(true)
);

export const category: Category = 'fun';
