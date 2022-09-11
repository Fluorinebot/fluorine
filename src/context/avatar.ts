import type { FluorineClient } from '#classes';
import { getAvatarComponents, getAvatarEmbed } from '#util';
import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    GuildMember,
    type InteractionReplyOptions,
    type UserContextMenuCommandInteraction
} from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: UserContextMenuCommandInteraction<'cached'>
): Promise<void> {
    const user = interaction.targetMember ?? interaction.targetUser;

    const replyOptions: InteractionReplyOptions = {
        embeds: [getAvatarEmbed(client, interaction, user, 'guild')]
    };

    if (user instanceof GuildMember && user.avatar) {
        replyOptions.components = [getAvatarComponents(client, interaction, user, 'guild')];
    }

    interaction.reply(replyOptions);
}

export const data = new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setNameLocalizations({ pl: 'Avatar' })
    .setType(ApplicationCommandType.User);
