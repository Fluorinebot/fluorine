import FluorineClient from '@classes/Client';
import { getComponents, getEmbed } from '@util/avatar';
import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    UserContextMenuCommandInteraction,
    InteractionReplyOptions,
    GuildMember
} from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: UserContextMenuCommandInteraction<'cached'>
): Promise<void> {
    const user = interaction.targetMember ?? interaction.targetUser;

    const replyOptions: InteractionReplyOptions = {
        embeds: [getEmbed(client, interaction, user, 'guild')]
    };

    if (user instanceof GuildMember && user.avatar) {
        replyOptions.components = [getComponents(client, interaction, user, 'guild')];
    }

    interaction.reply(replyOptions);
}

export const data = new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setNameLocalizations({ pl: 'Avatar' })
    .setType(ApplicationCommandType.User);
