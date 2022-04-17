import FluorineClient from '@classes/Client';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { execSync } from 'child_process';
import { CommandInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    await interaction.deferReply();
    execSync('git pull');
    execSync('npm run build');
    execSync('npm i');
    interaction.editReply('Successfully updated');
}

export const data = new SlashCommandSubcommandBuilder().setName('update').setDescription('Update the bot.');
