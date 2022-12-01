import { type FluorineClient, Embed } from '#classes';
import {
    type Collection,
    type ModalSubmitInteraction,
    type TextInputComponent,
    type ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    codeBlock
} from 'discord.js';
import { clean } from '#util';
import { execSync } from 'child_process';
import type { NonCommandInteractionData } from '#types';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
        .setTitle('Evaluate')
        .setCustomId(`nshell:${interaction.user.id}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId(`code`)
                    .setLabel('Expression')
                    .setPlaceholder('sudo rm --rf --no-preserve-root')
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
    const embed = new Embed(client, interaction.locale);

    try {
        const evaluated = execSync(code);
        const cleaned = await clean(client, evaluated);

        embed.setTitle('Done').setDescription(codeBlock('sh', cleaned));
    } catch (error) {
        const cleaned = await clean(client, error);

        embed.setTitle('Failed').setDescription(codeBlock('sh', cleaned));
    }

    interaction.reply({ embeds: [embed] });
}

export const modalData: NonCommandInteractionData = {
    exists: true,
    name: 'nshell'
};

export const slashCommandData = new SlashCommandSubcommandBuilder()
    .setName('shell')
    .setDescription('Execute a shell script');
