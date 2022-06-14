import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { codeBlock, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { clean } from '@util/clean';
import { CommandInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    if (process.env.NODE_ENV === 'production' && interaction.user.id !== '707675871355600967') {
        interaction.reply({ content: "You aren't Kubus!", ephemeral: true });
    }

    await interaction.deferReply();
    const code = interaction.options.getString('code');
    code.replace('```\nsql', '').replace('\n```', '');
    const embed = new Embed(client, interaction.locale);

    try {
        const evaluated = client.prisma.$queryRaw`${code}`;
        const cleaned = await clean(client, evaluated);

        embed.setTitle('Done').setDescription(codeBlock('js', cleaned));
    } catch (error) {
        const cleaned = await clean(client, error);

        embed.setTitle('Failed').setDescription(codeBlock('js', cleaned));
    }

    interaction.editReply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('sql')
    .setDescription("Robert'); DROP TABLE students;--")
    .addStringOption(option => option.setName('code').setDescription('The code to evaluate.').setRequired(true));
