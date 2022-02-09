import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';
import hash from 'murmurhash-v3';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const question = interaction.options.getString('question');
    const responseId = hash(question) % 6;

    const embed = new Embed(client, interaction.locale).setDescription(question).addLocaleField({
        name: '8BALL_RESPONSE',
        localeValue: `8BALL_RESPONSES.${responseId}`
    });
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic ball a question')
    .addStringOption(option => option.setName('question').setDescription('Ask a question').setRequired(true));

export const category: Category = 'fun';
