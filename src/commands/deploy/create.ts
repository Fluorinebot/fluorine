import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v10';
import { type ChatInputCommandInteraction } from 'tiscord';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.defer();

    const name = interaction.options.getString('command');
    let guildId = interaction.options.getString('guild');
    const command = client.commands.chatInput.get(name) ?? client.commands.contextMenu.get(name);

    if (!command && name !== 'all') {
        console.log('Deez');
        return interaction.editReply({ content: `Command \`${name}\` not found.` });
    }
    if (guildId === 'this') {
        ({ guildId } = interaction);
    }
    const route = guildId
        ? Routes.applicationGuildCommands(client.user.id, guildId)
        : Routes.applicationCommands(client.user.id);

    try {
        if (name === 'all') {
            console.log('lol');
            const chatInputCommands = [...client.commands.chatInput.values()]
                .filter(
                    c =>
                        // @ts-expect-error
                        c.data.toJSON().type !== 1 && !c.dev
                )
                .map(command => command.data.toJSON());

            const contextMenuCommands = [...client.commands.contextMenu.values()]
                .filter(c => !c.dev)
                .map(command => command.data.toJSON());
            console.log(contextMenuCommands);
            console.log('Hi ?');
            await client.rest.put(route, {
                body: [...chatInputCommands, ...contextMenuCommands]
            });
            console.log('broooo');
            await interaction.editReply({ content: 'Added all commands.' });
        } else {
            await client.rest.post(route, {
                body: command.data.toJSON()
            });

            interaction.editReply({ content: `Added \`${command.data.name}\`.` });
        }
    } catch (error) {
        console.log(error);
        const embed = new Embed(client, interaction.locale)
            .setTitle('Failed')
            .setDescription(`\`\`\`js\n${error}\`\`\``);

        // interaction.editReply({ /** embeds: [embed.toJSON()] */ content: 'Deez' });
    }
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create application commands')
    .addStringOption(option =>
        option.setName('command').setDescription('Provide a command to create').setRequired(true)
    )
    .addStringOption(option => option.setName('guild').setDescription('Provide a guild to deploy').setRequired(false));
