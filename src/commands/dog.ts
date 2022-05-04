import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/structures';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const { file } = (await fetch('https://api.alexflipnote.dev/dogs').then(response => response.json())) as {
        file: string;
    };

    const embed = new Embed(client, interaction.locale).setLocaleTitle('DOG').setImage(file);
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('dog')
    .setNameLocalizations({ pl: 'pies' })
    .setDescription('Random dog picture')
    .setDescriptionLocalizations({ pl: 'Losowe zdjęcie psa' });

export const category: Category = 'fun';
