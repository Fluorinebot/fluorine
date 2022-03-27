import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { codeBlock, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import clean from '@util/clean';
import { CommandInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    await interaction.deferReply();
    const code = interaction.options.getString('code');
    code.replace('```\njs', '').replace('\n```', '');
    const embed = new Embed(client, interaction.locale);

    try {
        const evaluated = eval(code);
        const cleaned = await clean(client, evaluated);

        embed.setTitle('Done').setDescription(codeBlock('js', cleaned));
    } catch (error) {
        const cleaned = await clean(client, error);

        embed.setTitle('Failed').setDescription(codeBlock('js', cleaned));
    }

    interaction.editReply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('eval')
    .setDescription('Evaluates a given exprssion.')
    .addStringOption(option => option.setName('code').setDescription('The code to evaluate.').setRequired(true));
