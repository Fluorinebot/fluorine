import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types';
import { MessageContextMenuInteraction } from 'discord.js';
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
            temperature: 0.8
        })
    }).then(res => res.json())) as any;
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('AI_TITLE')
        .setLocaleDescription('AI_DESCRIPTION', { text: response.answers[0] });
    interaction.reply({ embeds: [embed] });
    client.aiCooldown.add(interaction.user.id);
    setTimeout(() => {
        client.aiCooldown.delete(interaction.user.id);
    }, 10000);
}

export const data = new ContextMenuCommandBuilder().setName('AI').setType(ApplicationCommandType.Message);
