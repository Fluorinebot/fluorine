import { SlashCommandBuilder } from '#builders';
import { Embed, type FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

import type { fetch as _fetch } from 'undici';
declare const fetch: typeof _fetch;

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const { file } = (await fetch('https://api.alexflipnote.dev/birb').then(response => response.json())) as {
        file: string;
    };

    const embed = new Embed(client, interaction.locale).setLocaleTitle('BIRB').setImage(file);
    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('BIRB');
export const category: Category = 'fun';
