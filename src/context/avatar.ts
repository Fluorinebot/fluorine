import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { UserContextMenuInteraction, InteractionReplyOptions, MessageActionRow, MessageButton } from 'discord.js';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types';

export async function run(client: FluorineClient, interaction: UserContextMenuInteraction<'cached'>): Promise<void> {
    if (interaction.targetMember) {
        const member = interaction.targetMember;

        const embed = new Embed(client, interaction.locale)
            .setLocaleTitle('AVATAR')
            .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));

        const replyOptions: InteractionReplyOptions = { embeds: [embed] };

        if (member.avatar) {
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`avatar:${interaction.user.id}:${member.id}.guild`)
                    .setLabel(client.i18n.t('AVATAR_GUILD', { lng: interaction.locale }))
                    .setDisabled(true)
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(`avatar:${interaction.user.id}:${member.id}.user`)
                    .setLabel(client.i18n.t('AVATAR_USER', { lng: interaction.locale }))
                    .setStyle('PRIMARY')
            );

            replyOptions.components = [row];
        }

        interaction.reply(replyOptions);
    } else {
        const user = interaction.targetUser;

        const embed = new Embed(client, interaction.locale)
            .setLocaleTitle('AVATAR')
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }));
        interaction.reply({ embeds: [embed] });
    }
}

export const data = new ContextMenuCommandBuilder().setName('Avatar').setType(ApplicationCommandType.User);
