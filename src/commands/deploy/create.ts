import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const rest = new REST({ version: '9' }).setToken(client.token);

    const name = interaction.options.getString('command');
    let guildId = interaction.options.getString('guild');
    const command = name.endsWith('.con')
        ? client.applicationCommands.contextMenu.get(name.replace('.con', ''))
        : client.applicationCommands.chatInput.get(name);

    if (!command && name !== 'all')
        return interaction.reply({
            content: 'Command not found',
            ephemeral: true
        });
    if (guildId === 'this') guildId = interaction.guild.id;
    const route = guildId
        ? Routes.applicationGuildCommands(client.user.id, guildId)
        : Routes.applicationCommands(client.user.id);

    try {
        if (name === 'all') {
            await interaction.deferReply();

            await Promise.all(
                client.applicationCommands.chatInput
                    .filter(c => c.data && !c.dev)
                    .map(command =>
                        rest.post(route, {
                            body: command.data.toJSON()
                        })
                    )
            );
            await Promise.all(
                client.applicationCommands.contextMenu
                    .filter(c => c.data && !c.dev)
                    .map(command =>
                        rest.post(route, {
                            body: command.data.toJSON()
                        })
                    )
            );

            await interaction.editReply('Added all commands.');
        } else {
            await rest.post(route, {
                body: command.data.toJSON()
            });

            interaction.reply(`Added \`${command.data.name}\``);
        }
    } catch (error) {
        const embed = new Embed(client, interaction.locale)
            .setTitle('Failed')
            .setDescription(`\`\`\`js\n${error}\`\`\``);

        interaction.deferred ? interaction.editReply({ embeds: [embed] }) : interaction.reply({ embeds: [embed] });
    }
}
