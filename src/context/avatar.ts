import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction<'cached'>
) {
    const member = interaction.options.getMember('user');

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('AVATAR')
        .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));
    interaction.reply({ embeds: [embed] });
}

export const data = new ContextMenuCommandBuilder()
    .setName('View avatar')
    .setType(ApplicationCommandType.User);

export const dev = true;
