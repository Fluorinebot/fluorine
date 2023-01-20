import { EmbedBuilder, SlashCommandSubcommandBuilder } from '#builders';
import { type FluorineClient } from '#classes';
import type { NonCommandInteractionData } from '#types';
import { clean } from '#util';
import {
    type Collection,
    type ModalSubmitInteraction,
    type TextInputComponent,
    type ChatInputCommandInteraction,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    codeBlock
} from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
        .setTitle('Evaluate')
        .setCustomId(`eval:${interaction.user.id}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId(`code`)
                    .setLabel('Expression')
                    .setPlaceholder(`console.log('sex balls');`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(4000)
                    .setRequired(true)
            )
        );

    interaction.showModal(modal);
}

export async function onModal(
    client: FluorineClient,
    interaction: ModalSubmitInteraction,
    fields: Collection<string, TextInputComponent>
) {
    const code = fields.get('code').value;
    code.replace('```js\n', '').replace('\n```', '');
    const embed = new EmbedBuilder(client, interaction.locale);

    try {
        const evaluated = eval(code);
        const cleaned = await clean(client, evaluated);

        embed.setTitle('Done', { raw: true }).setDescription(codeBlock('js', cleaned), { raw: true });
    } catch (error) {
        const cleaned = await clean(client, error);

        embed.setTitle('Failed', { raw: true }).setDescription(codeBlock('js', cleaned), { raw: true });
    }

    interaction.reply({ embeds: [embed.builder] });
}

export const modalData: NonCommandInteractionData = {
    exists: true,
    name: 'eval'
};

export const slashCommandData = new SlashCommandSubcommandBuilder('EVAL');
