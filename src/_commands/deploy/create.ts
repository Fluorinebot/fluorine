import { Embed, type FluorineClient } from '#classes';
import { type ChatInputCommandInteraction, Routes, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const name = interaction.options.getString('command');
    let guildId = interaction.options.getString('guild');
    const command = client.commands.chatInput.get(name) ?? client.commands.contextMenu.get(name);

    if (!command && name !== 'all') {
        return interaction.editReply(`Command \`${name}\` not found.`);
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

            const chatInputCommands = client.commands.chatInput
                .filter(c => 'category' in c && (commands.cache.some(cmd => cmd.name === 'deploy') || !c.dev))
                .map(command => command.data.toJSON());

            const contextMenuCommands = client.commands.contextMenu
                .filter(c => commands.cache.some(cmd => cmd.name === 'deploy') || !c.dev)
                .map(command => command.data.toJSON());

            await client.rest.put(route, {
                body: [...chatInputCommands, ...contextMenuCommands]
            });

            await interaction.editReply('Added all commands.');
        } else {
            await client.rest.post(route, {
                body: command.data.toJSON()
            });

            interaction.editReply(`Added \`${command.data.name}\`.`);
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
