import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { clean } from '#util/clean';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'tiscord';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.defer();
    const code = interaction.options.getString('code');
    code.replace('```\njs', '').replace('\n```', '');
    const embed = new Embed(client, interaction.locale);

    try {
        const evaluated = eval(code);
        const cleaned = await clean(client, evaluated);

        embed.setTitle('Done').setDescription(`\`\`\`js\n${cleaned}\n\`\`\``);
    } catch (error) {
        const cleaned = await clean(client, error);

        embed.setTitle('Failed').setDescription(`\`\`\`js\n${cleaned}\n\`\`\``);
    }

    interaction.editReply({ embeds: [embed.toJSON()] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('eval')
    .setDescription('Evaluates a given exprssion.')
    .addStringOption(option => option.setName('code').setDescription('The code to evaluate.').setRequired(true));
