import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import type { Category } from '#types/structures';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const { file } = (await fetch('https://api.alexflipnote.dev/cats').then(response => response.json())) as {
        file: string;
    };

    const embed = new Embed(client, interaction.locale).setLocaleTitle('CAT').setImage(file);
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('cat')
    .setNameLocalizations({ pl: 'kot' })
    .setDescription('Random cat picture')
    .setDescriptionLocalizations({ pl: 'Losowe zdjęcie kota' });

export const category: Category = 'fun';
