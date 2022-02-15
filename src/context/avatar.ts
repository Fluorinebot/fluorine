import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import {
    UserContextMenuInteraction,
    InteractionReplyOptions,
    MessageActionRow,
    MessageButton,
    GuildMember
} from 'discord.js';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v9';

export async function run(client: FluorineClient, interaction: UserContextMenuInteraction<'cached'>): Promise<void> {
    const user = interaction.targetMember ?? interaction.targetUser;

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('AVATAR')
        .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }));

    const replyOptions: InteractionReplyOptions = { embeds: [embed] };

    if (user instanceof GuildMember && user.avatar) {
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`avatar:${interaction.user.id}:${user.id}.guild`)
                .setLabel(client.i18n.t('AVATAR_GUILD', { lng: interaction.locale }))
                .setDisabled(true)
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId(`avatar:${interaction.user.id}:${user.id}.user`)
                .setLabel(client.i18n.t('AVATAR_USER', { lng: interaction.locale }))
                .setStyle('PRIMARY')
        );

        replyOptions.components = [row];
    }

    interaction.reply(replyOptions);
}

export const data = new ContextMenuCommandBuilder().setName('Avatar').setType(ApplicationCommandType.User);
