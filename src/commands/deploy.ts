import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
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

    if (
        !['707675871355600967', '478823932913516544'].includes(
            interaction.user.id
        )
    ) {
        return interaction.reply({
            content: "You don't have perms LOOOOOL",
            ephemeral: true
        });
    }

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
            await Promise.all(
                client.applicationCommands.map(command =>
                    rest.post(route, {
                        body: command.data?.toJSON()
                    })
                )
            );
        } else {
            await rest.post(route, {
                body: command.data.toJSON()
            });
        }
        interaction.reply('done');
    } catch (error) {
        const embed = new Embed(client, interaction.guild.preferredLocale)
            .setTitle('fail')
            .setDescription(`\`\`\`js\n${error}\`\`\``);
        interaction.reply({ embeds: [embed] });
    }
}

export const data = new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('Deploy application commands')
    .addStringOption(option =>
        option
            .setName('command')
            .setDescription('Provide a command to deploy')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('guild')
            .setDescription('Provide a guild to deploy')
            .setRequired(false)
    );

export const help = {
    name: 'deploy',
    description: 'Deploy application commands',
    aliases: [],
    category: 'tools'
};
