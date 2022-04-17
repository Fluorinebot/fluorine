import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { fetch } from 'undici';
import { Category } from 'types/structures';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const { file } = (await fetch('https://api.alexflipnote.dev/cats').then(response => response.json())) as {
        file: string;
    };

    const embed = new Embed(client, interaction.locale).setLocaleTitle('CAT').setImage(file);
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('cat')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Random cat picture')
    .setDescriptionLocalizations({ pl: 'replace_me' });

export const category: Category = 'fun';
