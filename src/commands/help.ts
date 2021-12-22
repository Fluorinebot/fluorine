import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import {
    CommandInteraction,
    EmbedFieldData,
    MessageActionRow,
    MessageSelectMenu
} from 'discord.js';

enum HelpTitles {
    fun = '🎮 Fun',
    tools = '🛠️ Narzędzia',
    moderation = '🔨 Moderacja'
}

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const category = interaction.options.getString('category');
    const commands = client.cmds.filter(c => c.help.category === category);

    const fields: EmbedFieldData[] = commands.map(c => ({
        name: c.help.name,
        value: c.help.description
    }));

    const embed = new Embed()
        .setTitle(HelpTitles[category])
        .setFields(fields)
        .setFooter(client.footer);

    const row = new MessageActionRow().addComponents([
        new MessageSelectMenu()
            .setCustomId(`help:${interaction.user.id}`)
            .setOptions([
                {
                    label: 'Fun',
                    value: 'fun',
                    emoji: '🎮',
                    default: category === 'fun'
                },
                {
                    label: 'Narzędzia',
                    value: 'tools',
                    emoji: '🛠️',
                    default: category === 'tools'
                },
                {
                    label: 'Moderacja',
                    value: 'moderation',
                    emoji: '🔨',
                    default: category === 'moderation'
                }
            ])
    ]);

    interaction.reply({
        embeds: [embed],
        components: [row]
    });
}

export const help = {
    name: 'help',
    description: 'Lista komend',
    aliases: ['pomoc', 'h'],
    category: 'tools'
};
