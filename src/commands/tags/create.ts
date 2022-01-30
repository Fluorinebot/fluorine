import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const name = interaction.options.getString('name');
    const content = interaction.options.getString('content');
    const ephemeral = interaction.options.getString('ephemeral');

    interaction.reply({
        content: client.tags.parseContent(content, interaction)
    });
}
