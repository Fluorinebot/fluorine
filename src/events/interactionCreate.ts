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
                    interaction.guild.preferredLocale,
                    'COMPONENT_PRIVATE'
                ),
                ephemeral: true
            });
        }

        component?.run(client, interaction, value);
    }

    if (!interaction.isCommand()) return;

    if (client.cooldown.has(interaction.user.id)) {
        const coolEmbed = new Embed(client, interaction.guild.preferredLocale)
            .setLocaleTitle('MESSAGE_CREATE_COOLDOWN_TITLE')
            .setLocaleDescription('MESSAGE_CREATE_COOLDOWN_DESCRIPTION');
        return interaction.reply({ embeds: [coolEmbed], ephemeral: true });
    }

    client.cooldown.add(interaction.user.id);
    if (interaction.user.id !== '817883855310684180') {
        setTimeout(() => client.cooldown.delete(interaction.user.id), 2000);
    }

    const command = client.applicationCommands.get(interaction.commandName);
    if (!command) return;

    command.run(client, interaction);
    if (command.help.category !== 'dev') {
        client.statcord.postCommand(command.help.name, interaction.user.id);
    }
}
