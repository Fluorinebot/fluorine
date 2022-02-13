import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { codeBlock } from '@discordjs/builders';
import clean from '@util/clean';
import { CommandInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    if (process.env.NODE_ENV === 'production' && interaction.user.id !== '707675871355600967') {
        interaction.reply({ content: "You aren't Kubus!", ephemeral: true });
    }

    await interaction.deferReply();
    const code = interaction.options.getString('code');
    code.replace('```\njs', '').replace('\n```', '');
    let embed;

    try {
        const evaluated = eval(code);
        const cleaned = await clean(client, evaluated);

        embed = new Embed(client, interaction.locale).setTitle('Done').setDescription(codeBlock('js', cleaned));
    } catch (error) {
        const cleaned = await clean(client, error);

        embed = new Embed(client, interaction.locale).setTitle('Failed').setDescription(codeBlock('js', cleaned));
    }

    interaction.editReply({ embeds: [embed] });
}
