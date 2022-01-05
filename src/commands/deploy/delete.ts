import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const name = interaction.options.getString('command');
    const guildId = interaction.options.getString('guild');

    if (
        !['707675871355600967', '478823932913516544'].includes(
            interaction.user.id
        )
    ) {
        return interaction.reply({
            content: "You don't have perms LOOOOOL",
            ephemeral: true
        });
    }

    try {
        const { commands } = guildId
            ? client.guilds.cache.get(guildId)
            : client.application;

        await commands.fetch(null, {});
        if (name === 'all') {
            commands.set([]);
        } else {
            commands.cache.get(name).delete();
        }
        interaction.reply('done');
    } catch (error) {
        const embed = new Embed(client, interaction.guild.preferredLocale)
            .setTitle('fail')
            .setDescription(`\`\`\`js\n${error}\`\`\``);
        interaction.reply({ embeds: [embed] });
    }
}
