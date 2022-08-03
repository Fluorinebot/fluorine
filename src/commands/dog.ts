import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { type ChatInputCommandInteraction } from 'tiscord';
import type { Category } from '#types/structures';
import { SlashCommandBuilder } from '@discordjs/builders';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const { file } = (await fetch('https://api.alexflipnote.dev/dogs').then(response => response.json())) as {
        file: string;
    };

    const embed = new Embed(client, interaction.locale).setLocaleTitle('DOG').setImage(file);
    interaction.reply({ embeds: [embed.toJSON()] });
}

export const data = new SlashCommandBuilder()
    .setName('dog')
    .setNameLocalizations({ pl: 'pies' })
    .setDescription('Random dog picture')
    .setDescriptionLocalizations({ pl: 'Losowe zdjęcie psa' });

export const category: Category = 'fun';
