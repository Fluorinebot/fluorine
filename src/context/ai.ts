import FluorineClient from '@classes/Client';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { MessageContextMenuInteraction } from 'discord.js';
export async function run(client: FluorineClient, interaction: MessageContextMenuInteraction) {
    const { content } = interaction.targetMessage;

    if (content.length > 65) {
        interaction.reply({
            content: client.i18n.t('AI_TOO_LONG', { lng: interaction.locale }),
            ephemeral: true
        });
    }
    if (client.ai.queue.some(q => q.interaction.user.id === interaction.user.id)) {
        interaction.reply({
            content: client.i18n.t('AI_LIMIT', { lng: interaction.locale }),
            ephemeral: true
        });
    }

    interaction.deferReply();
    client.ai.getAI(interaction, content);
}

export const data = new ContextMenuCommandBuilder()
    .setName('AI')
    .setNameLocalizations({ pl: 'AI' })
    .setType(ApplicationCommandType.Message);
