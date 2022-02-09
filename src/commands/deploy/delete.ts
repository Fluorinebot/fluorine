import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const name = interaction.options.getString('command');
    const guildId = interaction.options.getString('guild');

    try {
        const { commands } = client.guilds.cache.get(guildId) ?? client.application;

        // @ts-ignore
        await commands.fetch();

        if (name === 'all') {
            await commands.set([]);
        } else {
            const command = commands.cache.find(c => c.name === name);
            if (!command)
                return interaction.reply({
                    content: 'Command not found',
                    ephemeral: true
                });
            await command.delete();
        }
        interaction.reply('done');
    } catch (error) {
        const embed = new Embed(client, interaction.locale)
            .setTitle('fail')
            .setDescription(`\`\`\`js\n${error}\n${error.stack}\`\`\``);
        interaction.reply({ embeds: [embed] });
    }
}
