import { Embed, type FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import type { fetch as _fetch } from 'undici';
declare const fetch: typeof _fetch;

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const { file } = (await fetch('https://api.alexflipnote.dev/cats').then(response => response.json())) as {
        file: string;
    };

    const embed = new Embed(client, interaction.locale).setLocaleTitle('CAT').setImage(file);
    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder()
    .setName('cat')
    .setNameLocalizations({ pl: 'kot' })
    .setDescription('Random cat picture')
    .setDescriptionLocalizations({ pl: 'Losowe zdjęcie kota' });

export const category: Category = 'fun';
