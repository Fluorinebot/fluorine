import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import EventHandler from '#handlers/EventHandler';
import { execSync } from 'child_process';
import { type ChatInputCommandInteraction } from 'tiscord';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const type = interaction.options.getString('type');
    const module = interaction.options.getString('module');

    await interaction.defer(true);

    try {
        if (process.env.NODE_ENV === 'development') {
            execSync('npm run build');
        }

        if (module === 'all') {
            const files = await readdir(join(__dirname, `../../${type}`));
            for (const file of files) {
                const path = join(__dirname, `../../${type}`, file);
                delete require.cache[require.resolve(path)];
            }
        } else {
            delete require.cache[require.resolve(`./../../${type}/${module}`)];
        }

        switch (type) {
            case 'events': {
                if (module === 'all') {
                    client.logger.warn(`All events taken offline.`);
                    client.removeAllListeners();
                    await new EventHandler(client).loadEvents();
                    client.logger.log(`All events back online.`);

                    return interaction.editReply({ content: 'Reloaded all events.' });
                }

                const eventFile = await import(`./../../events/${module}`);

                client.logger.warn(`${module} event taken offline.`);
                client.removeAllListeners(module);
                // @ts-expect-error
                client.on(module, (...event) => {
                    eventFile.run(client, ...event);
                });
                client.logger.log(`${module} event back online.`);

                interaction.editReply({ content: `Reloaded the \`${module}\` event.` });
                break;
            }

            case 'commands': {
                if (module === 'all') {
                    await client.commands.loadChatInput();
                    return interaction.editReply({ content: 'Reloaded `all` chat input commands.' });
                }

                const commandFile = await import(`./../../commands/${module}`);
                client.commands.chatInput.set(module, commandFile);

                interaction.editReply({ content: `Reloaded the \`${module}\` chat input command.` });
                break;
            }

            case 'context': {
                if (module === 'all') {
                    await client.commands.loadContextMenu();
                    return interaction.editReply({ content: 'Reloaded `all` context menu commands.' });
                }

                const commandFile = await import(`./../../context/${module}`);
                client.commands.contextMenu.set(module, commandFile);

                interaction.editReply({ content: `Reloaded the \`${module}\` context menu command.` });
                break;
            }

            case 'components': {
                if (module === 'all') {
                    await client.components.loadComponents();
                    return interaction.editReply({ content: 'Reloaded `all` components.' });
                }

                const commandFile = await import(`./../../components/${module}`);
                client.components.set(module, commandFile);

                interaction.editReply({ content: `Reloaded the \`${module}\` component.` });
                break;
            }
        }
    } catch (error) {
        const embed = new Embed(client, interaction.locale)
            .setTitle('Failed')
            .setDescription(`\`\`\`js\n${error.stack}\n\`\`\``);

        interaction.editReply({ embeds: [embed.toJSON()] });
    }
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('reload')
    .setDescription('Reloads a module.')
    .addStringOption(option =>
        option.setName('type').setDescription('The type of the module.').setRequired(true).setChoices(
            {
                name: 'Event',
                value: 'events'
            },
            {
                name: 'Chat Input Command',
                value: 'commands'
            },
            {
                name: 'Context Menu Command',
                value: 'context'
            },
            {
                name: 'Component',
                value: 'components'
            }
        )
    )
    .addStringOption(option =>
        option.setName('module').setDescription("The module that you're reloading.").setRequired(true)
    );
