import { Embed, type FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
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

export const slashCommandData = new SlashCommandBuilder()
    .setName('8ball')
    .setNameLocalizations({ pl: 'magiczna-kula' })
    .setDescription('Ask the magic ball a question')
    .setDescriptionLocalizations({ pl: 'Zapytaj o coś magiczną kulę' })
    .addStringOption(option =>
        option
            .setName('question')
            .setNameLocalizations({ pl: 'pytanie' })
            .setDescription('Ask a question')
            .setDescriptionLocalizations({ pl: 'Zadaj pytanie' })
            .setRequired(true)
    );

export const category: Category = 'fun';
