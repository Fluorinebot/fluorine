import { SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { ChatInputCommandInteraction } from 'discord.js';
import { execSync } from 'node:child_process';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    execSync('git pull');
    execSync('npm i');
    execSync('npm run build');

    interaction.editReply('Successfully updated');
}

export const slashCommandData = new SlashCommandSubcommandBuilder('UPDATE');
