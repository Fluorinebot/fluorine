import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

import type { fetch as _fetch } from 'undici';
declare const fetch: typeof _fetch;

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const { file } = (await fetch('https://api.alexflipnote.dev/cats').then((response) => response.json())) as {
        file: string;
    };

    const embed = new EmbedBuilder(client, interaction.locale).setTitle('CAT').setImage(file);
    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('CAT');
export const category: Category = 'fun';
