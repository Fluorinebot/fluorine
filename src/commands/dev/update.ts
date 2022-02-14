import FluorineClient from '@classes/Client';
import { execSync } from 'child_process';
import { CommandInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    await interaction.deferReply();
    execSync('git pull');
    execSync('npm run build');
    execSync('npm i');
    interaction.editReply('Successfully updated');
}
