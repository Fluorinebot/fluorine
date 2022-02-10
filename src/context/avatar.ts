import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types';
import { UserContextMenuInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: UserContextMenuInteraction<'cached'>): Promise<void> {
    const user = interaction.targetMember ?? interaction.targetUser;

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('AVATAR')
        .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }));
    interaction.reply({ embeds: [embed] });
}

export const data = new ContextMenuCommandBuilder().setName('Avatar').setType(ApplicationCommandType.User);
