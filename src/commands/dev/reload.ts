import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { codeBlock, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { execSync } from 'child_process';
import { readdir } from 'fs/promises';
import { join } from 'path';
import EventHandler from '@handlers/EventHandler';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const type = interaction.options.getString('type');
    const module = interaction.options.getString('module');

    await interaction.deferReply({ ephemeral: true });

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

                    return interaction.editReply('Reloaded all events.');
                }

                const eventFile = await import(`./../../events/${module}`);

                client.logger.warn(`${module} event taken offline.`);
                client.removeAllListeners(module);

                client.on(module, (...event) => {
                    eventFile.run(client, ...event);
                });
                client.logger.log(`${module} event back online.`);

                interaction.editReply(`Reloaded the \`${module}\` event.`);
                break;
            }

            case 'commands': {
                if (module === 'all') {
                    await client.applicationCommands.loadChatInput();
                    return interaction.editReply('Reloaded `all` chat input commands.');
                }

                const commandFile = await import(`./../../commands/${module}`);
                client.applicationCommands.chatInput.set(module, commandFile);

                interaction.editReply(`Reloaded the \`${module}\` chat input command.`);
                break;
            }

            case 'context': {
                if (module === 'all') {
                    await client.applicationCommands.loadContextMenu();
                    return interaction.editReply('Reloaded `all` context menu commands.');
                }

                const commandFile = await import(`./../../context/${module}`);
                client.applicationCommands.contextMenu.set(module, commandFile);

                interaction.editReply(`Reloaded the \`${module}\` context menu command.`);
                break;
            }

            case 'components': {
                if (module === 'all') {
                    await client.components.loadComponents();
                    return interaction.editReply('Reloaded `all` components.');
                }

                const commandFile = await import(`./../../components/${module}`);
                client.components.set(module, commandFile);

                interaction.editReply(`Reloaded the \`${module}\` component.`);
                break;
            }
        }
    } catch (error) {
        const embed = new Embed(client, interaction.locale)
            .setTitle('Failed')
            .setDescription(codeBlock('js', error.stack));

        interaction.editReply({ embeds: [embed] });
    }
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('reload')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Reloads a module.')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addStringOption(option =>
        option
            .setName('type')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('The type of the module.')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
            .setChoices(
                {
                    name: 'Event',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'events'
                },
                {
                    name: 'Chat Input Command',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'commands'
                },
                {
                    name: 'Context Menu Command',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'context'
                },
                {
                    name: 'Component',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'components'
                }
            )
    )
    .addStringOption(option =>
        option
            .setName('module')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription("The module that you're reloading.")
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    );
