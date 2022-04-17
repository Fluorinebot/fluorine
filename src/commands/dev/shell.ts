import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { codeBlock, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { execSync } from 'child_process';
import { CommandInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    if (process.env.NODE_ENV === 'production' && interaction.user.id !== '707675871355600967') {
        interaction.reply({ content: "You aren't Kubus!", ephemeral: true });
    }

    await interaction.deferReply();
    const script = interaction.options.getString('script');
    script.replace('```\nsh', '').replace('\n```', '');
    const embed = new Embed(client, interaction.locale);

    try {
        const result = execSync(script).toString();
        embed.setTitle('Done').setDescription(codeBlock('sh', result));
    } catch (error) {
        embed.setTitle('Failed').setDescription(codeBlock('sh', error));
    }

    interaction.editReply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('shell')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Execute a shell script')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addStringOption(option =>
        option
            .setName('script')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('The shell script.')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    );
