import { EmbedBuilder, SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import { type ChatInputCommandInteraction, Routes } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const name = interaction.options.getString('command');
    let guildId = interaction.options.getString('guild');
    const command = client.chatInputCommands.get(name) ?? client.contextMenuCommands.get(name);

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

            const chatInputCommands = client.chatInputCommands
                .filter(
                    (c) =>
                        client.commands.isChatInputCommand(c) &&
                        (commands.cache.some((cmd) => cmd.name === 'deploy') || !c.dev)
                )
                .map((command) => command.slashCommandData.toJSON());

            const contextMenuCommands = client.contextMenuCommands
                .filter((c) => commands.cache.some((cmd) => cmd.name === 'deploy') || !c.dev)
                .map((command) => command.contextMenuCommandData.toJSON());

            await client.rest.put(route, {
                body: [...chatInputCommands, ...contextMenuCommands]
            });

            await interaction.editReply('Added all commands.');
        } else {
            await client.rest.post(route, {
                body: client.chatInputCommands.get(name)
                    ? command.slashCommandData?.toJSON()
                    : command.contextMenuCommandData?.toJSON()
            });

            interaction.editReply(
                `Added \`${
                    client.chatInputCommands.get(name)
                        ? command.slashCommandData?.name
                        : command.contextMenuCommandData?.name
                }\`.`
            );
        }
    } catch (error) {
        const embed = new EmbedBuilder(client, interaction.locale)
            .setTitle('Failed', { raw: true })
            .setDescription(`\`\`\`js\n${error}\`\`\``, { raw: true });

        interaction.editReply({ embeds: [embed] });
    }
}

export const slashCommandData = new SlashCommandSubcommandBuilder('CREATE')
    .addStringOption('COMMAND', (option) => option.setRequired(true))
    .addStringOption('GUILD');
