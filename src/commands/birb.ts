import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import type { Category } from '#types/structures';
import { SlashCommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'tiscord';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const { file } = (await fetch('https://api.alexflipnote.dev/birb').then(response => response.json())) as {
        file: string;
    };

    const embed = new Embed(client, interaction.locale).setLocaleTitle('BIRB').setImage(file);
    interaction.reply({ embeds: [embed.toJSON()] });
}

export const data = new SlashCommandBuilder()
    .setName('birb')
    .setNameLocalizations({ pl: 'birb' })
    .setDescription('Random bird picture')
    .setDescriptionLocalizations({ pl: 'Losowe zdjęcie ptaka' });

export const category: Category = 'fun';
