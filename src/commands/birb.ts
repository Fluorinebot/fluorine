import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/structures';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const { file } = (await fetch('https://api.alexflipnote.dev/birb').then(response => response.json())) as {
        file: string;
    };

    const embed = new Embed(client, interaction.locale).setLocaleTitle('BIRB').setImage(file);
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder().setName('birb').setDescription('Random bird picture');

export const category: Category = 'fun';
