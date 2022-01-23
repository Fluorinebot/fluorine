import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const rest = new REST({ version: '9' }).setToken(client.token);

    const name = interaction.options.getString('command');
    const guildId = interaction.options.getString('guild');
    const command = client.applicationCommands.get(name);

    if (!command && name !== 'all')
        return interaction.reply({
            content: 'Command not found',
            ephemeral: true
        });

    const route = guildId
        ? Routes.applicationGuildCommands(client.user.id, guildId)
        : Routes.applicationCommands(client.user.id);

    try {
        if (name === 'all') {
            await interaction.deferReply();
            await Promise.all(
                client.applicationCommands
                    .filter(c => c.data && c.data.name !== 'deploy')
                    .map(command =>
                        rest.post(route, {
                            body: command.data.toJSON()
                        })
                    )
            );
            await interaction.editReply('done');
        } else {
            await rest.post(route, {
                body: command.data.toJSON()
            });
            interaction.reply('done');
        }
    } catch (error) {
        const embed = new Embed(client, interaction.locale)
            .setTitle('fail')
            .setDescription(`\`\`\`js\n${error}\`\`\``);
        interaction.deferred
            ? interaction.editReply({ embeds: [embed] })
            : interaction.reply({ embeds: [embed] });
    }
}
