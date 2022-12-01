import type { FluorineClient } from '#classes';
import type { ChatInputCommand } from '#types';
import type { Interaction as EventInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: EventInteraction) {
    if (interaction.isChatInputCommand()) {
        const subcommand = interaction.options.getSubcommand(false);
        const key = subcommand ? `${interaction.commandName}/${subcommand}` : interaction.commandName;

        const command = client.chatInput.get(key);
        const { dev } = client.chatInput.get(interaction.commandName) as ChatInputCommand;

        if (command.slashCommandProps.cooldown) {
            const cooldown = await client.cooldowns.get(interaction.user, key);

            if (cooldown?.timestamp > Date.now()) {
                return interaction.reply({
                    content: client.i18n.t('INTERACTION_CREATE_COOLDOWN', {
                        lng: interaction.locale,
                        time: Math.floor(Number((await client.cooldowns.get(interaction.user, key)).timestamp) / 1000)
                    }),
                    ephemeral: true
                });
            }

            if (cooldown?.timestamp <= Date.now()) {
                await client.cooldowns.delete(interaction.user, key);
            }
        }

        if (dev && !client.devs.includes(interaction.user.id)) {
            return interaction.reply({
                content: 'You need to be a developer to do that!',
                ephemeral: true
            });
        }

        const run = command.onSlashCommand ?? command.onCommand ?? command.onInteraction;
        run?.(client, interaction);

        if (command.slashCommandProps.cooldown) {
            client.cooldowns.set(interaction.user, key, command.slashCommandProps.cooldown);
        }

        return;
    }

    if (interaction.isContextMenuCommand()) {
        const command = client.contextMenu.get(interaction.commandName);

        if (command.dev && !client.devs.includes(interaction.user.id)) {
            return interaction.reply({
                content: 'You need to be a developer to do that!',
                ephemeral: true
            });
        }

        const run = command.onContextMenuCommand ?? command.onCommand ?? command.onInteraction;
        run?.(client, interaction);
    }

    if (interaction.isMessageComponent()) {
        const [name, user, value] = interaction.customId.split(':');
        const component = client.components.get(name);

        if (component.componentData.authorOnly && interaction.user.id !== user) {
            return interaction.reply({
                content: client.i18n.t('PRIVATE_COMPONENT', {
                    lng: interaction.locale
                }),
                ephemeral: true
            });
        }

        const run = component.onComponent ?? component.onInteraction;
        return run?.(client, interaction, value);
    }

    if (interaction.isModalSubmit()) {
        const [name] = interaction.customId.split(':');
        const modal = client.modals.get(name);

        if (modal?.onModal) {
            modal?.onModal(client, interaction, interaction.fields.fields);
        } else {
            modal?.onInteraction(client, interaction);
        }
    }
}
