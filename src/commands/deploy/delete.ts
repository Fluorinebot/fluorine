import { EmbedBuilder, SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import { type ChatInputCommandInteraction, Routes } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const name = interaction.options.getString('command');
    let guildId = interaction.options.getString('guild');

    if (guildId === 'this') {
        guildId = interaction.guild.id;
    }

    try {
        const { commands } = client.guilds.cache.get(guildId) ?? client.application;

        const route = guildId
            ? Routes.applicationGuildCommands(client.user.id, guildId)
            : Routes.applicationCommands(client.user.id);

        // @ts-expect-error
        await commands.fetch();

        if (name === 'all') {
            await client.rest.put(route, {
                body:
                    guildId && commands.cache.some(c => c.name === 'deploy')
                        ? [client.chatInputCommands.get('deploy').slashCommandData.toJSON()]
                        : []
            });
        } else {
            const command = commands.cache.find(c => c.name === name);

            if (!command) {
                return interaction.editReply(`Command \`${name}\` not found. Are you sure it was deployed?`);
            }

            await command.delete();
            return interaction.editReply(`Deleted \`${name}\`.`);
        }

        interaction.editReply('Deleted all commands.');
    } catch (error) {
        const embed = new EmbedBuilder(client, interaction.locale)
            .setTitle('Failed', { raw: true })
            .setDescription(`\`\`\`js\n${error}\n${error.stack}\`\`\``, { raw: true });

        interaction.editReply({ embeds: [embed.builder] });
    }
}

export const slashCommandData = new SlashCommandSubcommandBuilder('DELETE')
    .addStringOption('COMMAND', option => option.setRequired(true))
    .addStringOption('GUILD');
