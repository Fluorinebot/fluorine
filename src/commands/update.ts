import FluorineClient from '@classes/Client';
import { execSync } from 'child_process';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/applicationCommand';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    await interaction.deferReply();
    execSync('git pull');
    execSync('npm run build');
    execSync('npm i');
    interaction.editReply('done');
}

export const data = new SlashCommandBuilder()
    .setName('update')
    .setDescription('Update the bot');

export const category: Category = 'tools';
export const dev = true;
