import type FluorineClient from '#classes/Client';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { execSync } from 'child_process';
import { type ChatInputCommandInteraction } from 'tiscord';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.defer();
    execSync('git pull');
    execSync('npm run build');
    execSync('npm i');
    interaction.editReply({ content: 'Successfully updated' });
}

export const data = new SlashCommandSubcommandBuilder().setName('update').setDescription('Update the bot.');
