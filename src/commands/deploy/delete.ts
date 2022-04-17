import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Routes } from 'discord-api-types/v10';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
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
            await client.restModule.put(route, {
                body:
                    guildId && commands.cache.some(c => c.name === 'deploy')
                        ? [client.applicationCommands.chatInput.get('deploy').data.toJSON()]
                        : []
            });
        } else {
            const command = commands.cache.find(c => c.name === name);

            if (!command) {
                return interaction.reply({
                    content: 'Command not found',
                    ephemeral: true
                });
            }

            await command.delete();
            return interaction.reply(`Deleted \`${name}\`.`);
        }

        interaction.reply('Deleted all commands.');
    } catch (error) {
        const embed = new Embed(client, interaction.locale)
            .setTitle('Failed')
            .setDescription(`\`\`\`js\n${error}\n${error.stack}\`\`\``);
        interaction.reply({ embeds: [embed] });
    }
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Delete application commands')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addStringOption(option =>
        option
            .setName('command')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Provide a command to delete')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('guild')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Provide a guild to deploy')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(false)
    );
