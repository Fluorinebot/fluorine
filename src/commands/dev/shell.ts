import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { codeBlock, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { execSync } from 'child_process';

import { type ChatInputCommandInteraction } from 'tiscord';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.defer();
    const script = interaction.options.getString('script');
    script.replace('```\nsh', '').replace('\n```', '');
    const embed = new Embed(client, interaction.locale);

    try {
        const result = execSync(script).toString();
        embed.setTitle('Done').setDescription(codeBlock('sh', result));
    } catch (error) {
        embed.setTitle('Failed').setDescription(codeBlock('sh', error));
    }

    interaction.editReply({ embeds: [embed.toJSON()] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('shell')
    .setDescription('Execute a shell script')
    .addStringOption(option => option.setName('script').setDescription('The shell script.').setRequired(true));
