import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const rest = new REST({ version: '9' }).setToken(client.token);

    const name = interaction.options.getString('command');
    const guildId = interaction.options.getString('guild');
    const command = client.applicationCommands.get(name);

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

    if (!command && name !== 'all')
        return interaction.reply({
            content: 'Command not found',
            ephemeral: true
        });

    const route = guildId
        ? Routes.applicationGuildCommands(client.user.id, guildId)
        : Routes.applicationCommands(client.user.id);

    try {
        if (name === 'all') {
            await interaction.deferReply();
            await Promise.all(
                client.applicationCommands
                    .filter(
                        c =>
                            c.data &&
                            c.data.name !== 'deploy' &&
                            !c.data.name.includes('/')
                    )
                    .map(command =>
                        rest.post(route, {
                            body: command.data.toJSON()
                        })
                    )
            );
            interaction.followUp('done');
        } else {
            await rest.post(route, {
                body: command.data.toJSON()
            });
            interaction.reply('done');
        }
    } catch (error) {
        const embed = new Embed(client, interaction.locale)
            .setTitle('fail')
            .setDescription(`\`\`\`js\n${error}\`\`\``);
        interaction.reply({ embeds: [embed] });
    }
}
