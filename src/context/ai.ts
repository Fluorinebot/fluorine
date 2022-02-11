import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types';
import { MessageContextMenuInteraction } from 'discord.js';
import { fetch } from 'undici';
export async function run(client: FluorineClient, interaction: MessageContextMenuInteraction) {
    const { content } = interaction.targetMessage;
    if (content.length > 80) {
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
    await interaction.deferReply();
    const response = (await fetch('https://api.openai.com/v1/answers', {
        headers: {
            Authorization: `Bearer ${process.env.AI_TOKEN}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            model: 'ada',
            question: content,
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
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('AI_TITLE')
        .setLocaleDescription('AI_DESCRIPTION', { text: response.answers[0] });
    interaction.editReply({ embeds: [embed] });
    client.aiCooldown.add(interaction.user.id);
    setTimeout(() => {
        client.aiCooldown.delete(interaction.user.id);
    }, 10000);
}

export const data = new ContextMenuCommandBuilder().setName('AI').setType(ApplicationCommandType.Message);
