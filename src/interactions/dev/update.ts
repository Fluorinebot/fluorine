import { execSync } from 'node:child_process';
import type { FluorineClient } from '#classes';
import { type ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

export async function doSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    execSync('git pull');
    execSync('npm i');
    execSync('npm run build');
    interaction.editReply('Successfully updated');
}

export const slashCommandData = new SlashCommandSubcommandBuilder().setName('update').setDescription('Update the bot.');
