import FluorineClient from '@classes/Client';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types';
import { MessageContextMenuInteraction } from 'discord.js';
export async function run(
    client: FluorineClient,
    interaction: MessageContextMenuInteraction
) {
    const { content } = interaction.targetMessage;
    if (
        client.ai.queue.filter(q => q.id === interaction.user.id).length !== 0
    ) {
        interaction.reply({
            content: client.language.get(interaction.locale, 'AI_LIMIT'),
            ephemeral: true
        });
    }
    interaction.deferReply();
    const value = Buffer.from(content || 'h', 'utf8')
        .toString('base64')
        .replaceAll('/', '_')
        .replaceAll('+', '-');
    client.ai.getAI(interaction, value);
}

export const data = new ContextMenuCommandBuilder()
    .setName('AI')
    .setType(ApplicationCommandType.Message);
