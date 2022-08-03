import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { type User, type Interaction, Member } from 'tiscord';

export function getComponents(
    client: FluorineClient,
    interaction: Interaction,
    member: Member,
    action: 'guild' | 'user'
) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`avatar:${interaction.user.id}:${member.id}.guild`)
            .setLabel(client.i18n.t('AVATAR_GUILD', { lng: interaction.locale }))
            .setStyle(ButtonStyle.Primary)
            .setDisabled(action === 'guild'),
        new ButtonBuilder()
            .setCustomId(`avatar:${interaction.user.id}:${member.id}.user`)
            .setLabel(client.i18n.t('AVATAR_USER', { lng: interaction.locale }))
            .setStyle(ButtonStyle.Primary)
            .setDisabled(action === 'user')
    );
}

export function getEmbed(
    client: FluorineClient,
    interaction: Interaction,
    member: Member | User,
    action: 'guild' | 'user'
) {
    const embed = new Embed(client, interaction.locale).setLocaleTitle('AVATAR');

    if (member instanceof Member) {
        switch (action) {
            case 'guild': {
                embed.setImage(`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png`);
                break;
            }

            case 'user': {
                embed.setImage(`https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`);
                break;
            }
        }
    } else {
        embed.setImage(`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png`);
    }

    return embed;
}
