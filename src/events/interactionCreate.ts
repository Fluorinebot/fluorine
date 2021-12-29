import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Interaction } from 'discord.js';

export async function run(client: FluorineClient, interaction: Interaction) {
    if (!interaction.isCommand()) return;

    if (!interaction.inCachedGuild()) {
        return interaction.reply({
            content: `Cześć! To polecenie wymaga, abyś był na serwerze i miał obecnego bota. [Możesz go zaprosić tutaj](${client.invite})`,
            ephemeral: true
        });
    }

    if (client.cooldown.has(interaction.user.id)) {
        const coolEmbed = new Embed(client, interaction.guild.preferredLocale)
            .setTitle('Zwolnij!')
            .setDescription(
                'Poczekaj 2 sekundy przed wykonaniem kolejnej komendy!'
            );
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
