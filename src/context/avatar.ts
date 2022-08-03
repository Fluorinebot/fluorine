import type FluorineClient from '#classes/Client';
import { getComponents, getEmbed } from '#util/avatar';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { Member, type RawMessageOptions, type UserContextMenuInteraction } from 'tiscord';

export async function run(client: FluorineClient, interaction: UserContextMenuInteraction): Promise<void> {
    const user = interaction.target;

    const replyOptions: RawMessageOptions = {
        embeds: [getEmbed(client, interaction, user, 'guild')]
    };

    if (user instanceof Member && user.avatar) {
        replyOptions.components = [getComponents(client, interaction, user, 'guild')];
    }

    interaction.reply(replyOptions);
}

export const data = new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setNameLocalizations({ pl: 'Avatar' })
    .setType(ApplicationCommandType.User);
