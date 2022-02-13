import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { codeBlock } from '@discordjs/builders';
import { execSync } from 'child_process';
import { CommandInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    if (process.env.NODE_ENV === 'production' && interaction.user.id !== '707675871355600967') {
        interaction.reply({ content: "You aren't Kubus!", ephemeral: true });
    }

    await interaction.deferReply();
    const script = interaction.options.getString('script');
    let embed;

    try {
        embed = new Embed(client, interaction.locale)
            .setTitle('Done')
            .setDescription(codeBlock('sh', execSync(script).toString()));
    } catch (error) {
        embed = new Embed(client, interaction.locale).setTitle('Failed').setDescription(codeBlock('sh', error));
    }

    interaction.editReply({ embeds: [embed] });
}
