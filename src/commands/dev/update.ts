import type FluorineClient from '#classes/Client';
import { execSync } from 'child_process';
import { type ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    execSync('git pull');
    execSync('npm run build');
    execSync('npm i');
    interaction.editReply('Successfully updated');
}

export const data = new SlashCommandSubcommandBuilder().setName('update').setDescription('Update the bot.');
