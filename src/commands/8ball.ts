import FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { Category } from '#types/structures';
import hash from 'murmurhash-v3';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
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

export const data = new SlashCommandBuilder()
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
