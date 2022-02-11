import FluorineClient from '@classes/Client';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';
import { fetch } from 'undici';
import Embed from '@classes/Embed';
export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const args = interaction.options.getString('start');
    if (args.length > 80) {
        return interaction.reply({
            content: client.i18n.t('AI_TOO_LONG', { lng: interaction.locale }),
            ephemeral: true
        });
    }
    if (client.aiCooldown.has(interaction.user.id)) {
        return interaction.reply({
            content: client.i18n.t('AI_COOLDOWN', { lng: interaction.locale })
        });
    }
    interaction.deferReply();
    const response = (await fetch('https://api.openai.com/v1/answers', {
        headers: {
            Authorization: `Bearer ${process.env.AI_TOKEN}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            model: 'ada',
            question: args,
            temperature: 0.3,
            examples: [
                ['Hello!', 'Hi! How are you?'],
                ['Do you like me?', 'Of course!']
            ],
            // eslint-disable-next-line camelcase
            examples_context: 'The AI likes you!',
            documents: []
        })
    }).then(res => res.json())) as any;
    const embed = new Embed(client, interaction.locale).setLocaleTitle('AI_TITLE').setDescription(response.answers[0]);
    interaction.editReply({ embeds: [embed] });
    client.aiCooldown.add(interaction.user.id);
    setTimeout(() => {
        client.aiCooldown.delete(interaction.user.id);
    }, 10000);
}
export const data = new SlashCommandBuilder()
    .setName('ai')
    .setDescription('Make AI complete your sentence')
    .addStringOption(option => option.setName('start').setDescription('Start of the sentence').setRequired(true));
export const category: Category = 'fun';
