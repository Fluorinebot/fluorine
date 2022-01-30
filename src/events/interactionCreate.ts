import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Interaction } from 'discord.js';

export async function run(client: FluorineClient, interaction: Interaction) {
    if (interaction.isMessageComponent()) {
        const [name, user, value] = interaction.customId.split(':');
        const component = client.components.get(name);

        if (component.authorOnly && interaction.user.id !== user) {
            return interaction.reply({
                content: client.language.get(
                    interaction.locale,
                    'COMPONENT_PRIVATE'
                ),
                ephemeral: true
            });
        }

        component?.run(client, interaction, value);
    } else if (interaction.isContextMenu()) {
        const contextCommand = client.applicationCommands.contextMenu.find(
            cmd => cmd.data?.name === interaction.commandName
        );

        if (contextCommand.dev && !client.devs.includes(interaction.user.id))
            return interaction.reply({
                content: 'You need to be a developer to do that!',
                ephemeral: true
            });
        contextCommand.run(client, interaction);
    }
    if (!interaction.isCommand()) return;

    if (client.cooldown.has(interaction.user.id)) {
        const coolEmbed = new Embed(client, interaction.locale)
            .setLocaleTitle('MESSAGE_CREATE_COOLDOWN_TITLE')
            .setLocaleDescription('MESSAGE_CREATE_COOLDOWN_DESCRIPTION');
        return interaction.reply({ embeds: [coolEmbed], ephemeral: true });
    }

    client.cooldown.add(interaction.user.id);
    if (interaction.user.id !== '817883855310684180') {
        setTimeout(() => client.cooldown.delete(interaction.user.id), 2000);
    }

    const subcommand = interaction.options.getSubcommand(false);
    const command = subcommand
        ? client.applicationCommands.chatInput.get(
              `${interaction.commandName}/${subcommand}`
          )
        : client.applicationCommands.chatInput.get(interaction.commandName);

    if (!command) {
        const tag = await client.tags.get(interaction, interaction.commandName);

        if (!tag) return;
        return interaction.reply(client.tags.parse(tag, interaction));
    }

    const { dev } = client.applicationCommands.chatInput.get(
        interaction.commandName
    );
    if (dev && !client.devs.includes(interaction.user.id))
        return interaction.reply({
            content: 'You need to be a developer to do that!',
            ephemeral: true
        });

    command.run(client, interaction);
}
