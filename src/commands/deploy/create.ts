import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    await interaction.deferReply();

    const name = interaction.options.getString('command');
    let guildId = interaction.options.getString('guild');
    const command = client.applicationCommands.chatInput.get(name) ?? client.applicationCommands.contextMenu.get(name);

    if (!command && name !== 'all') {
        return interaction.reply({
            content: 'Command not found',
            ephemeral: true
        });
    }
    if (guildId === 'this') {
        ({ guildId } = interaction);
    }
    const route = guildId
        ? Routes.applicationGuildCommands(client.user.id, guildId)
        : Routes.applicationCommands(client.user.id);

    try {
        if (name === 'all') {
            const { commands } = guildId ? client.guilds.cache.get(guildId) : client.application;

            // @ts-expect-error
            await commands?.fetch();

            const chatInputCommands = client.applicationCommands.chatInput
                .filter(c => 'category' in c && (commands.cache.some(cmd => cmd.name === 'deploy') || !c.dev))
                .map(command => command.data.toJSON());

            const contextMenuCommands = client.applicationCommands.contextMenu
                .filter(c => commands.cache.some(cmd => cmd.name === 'deploy') || !c.dev)
                .map(command => command.data.toJSON());

            await client.restModule.put(route, {
                body: [...chatInputCommands, ...contextMenuCommands]
            });

            await interaction.editReply('Added all commands.');
        } else {
            await client.restModule.post(route, {
                body: command.data.toJSON()
            });

            interaction.editReply(`Added \`${command.data.name}\``);
        }
    } catch (error) {
        const embed = new Embed(client, interaction.locale)
            .setTitle('Failed')
            .setDescription(`\`\`\`js\n${error}\`\`\``);

        interaction.editReply({ embeds: [embed] });
    }
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create application commands')
    .addStringOption(option =>
        option.setName('command').setDescription('Provide a command to create').setRequired(true)
    )
    .addStringOption(option => option.setName('guild').setDescription('Provide a guild to deploy').setRequired(false));
