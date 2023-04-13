import { EmbedBuilder, SlashCommandSubcommandBuilder } from '#builders';
import { type FluorineClient } from '#classes';
import type { NonCommandInteractionData } from '#types';
import { clean } from '#util';
import {
    ActionRowBuilder,
    type ChatInputCommandInteraction,
    type Collection,
    ModalBuilder,
    type ModalSubmitInteraction,
    TextInputBuilder,
    type TextInputComponent,
    TextInputStyle,
    codeBlock
} from 'discord.js';
import { execSync } from 'node:child_process';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
        .setTitle('Evaluate')
        .setCustomId(`shell:${interaction.user.id}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId('code')
                    .setLabel('Expression')
                    .setPlaceholder('sudo rm -rf --no-preserve-root')
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
    code.replace('```sh\n', '').replace('\n```', '');
    const embed = new EmbedBuilder(client, interaction.locale);

    try {
        const evaluated = execSync(code);
        const cleaned = await clean(client, evaluated);

        embed.setTitle('Done', { raw: true }).setDescription(codeBlock('sh', cleaned), { raw: true });
    } catch (error) {
        const cleaned = await clean(client, error);

        embed.setTitle('Failed', { raw: true }).setDescription(codeBlock('sh', cleaned), { raw: true });
    }

    interaction.reply({ embeds: [embed] });
}

export const modalData: NonCommandInteractionData = {
    exists: true,
    name: 'shell'
};

export const slashCommandData = new SlashCommandSubcommandBuilder('SHELL');
