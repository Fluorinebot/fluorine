import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { GuildMember, Interaction, MessageActionRow, MessageButton } from 'discord.js';

export function getComponents(
    client: FluorineClient,
    interaction: Interaction,
    member: GuildMember,
    action: 'guild' | 'user'
) {
    return new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(`avatar:${interaction.user.id}:${member.id}.guild`)
            .setLabel(client.i18n.t('AVATAR_GUILD', { lng: interaction.locale }))
            .setStyle('PRIMARY')
            .setDisabled(action === 'guild'),
        new MessageButton()
            .setCustomId(`avatar:${interaction.user.id}:${member.id}.user`)
            .setLabel(client.i18n.t('AVATAR_USER', { lng: interaction.locale }))
            .setStyle('PRIMARY')
            .setDisabled(action === 'user')
    );
}

export function getEmbed(
    client: FluorineClient,
    interaction: Interaction,
    member: GuildMember,
    action: 'guild' | 'user'
) {
    const embed = new Embed(client, interaction.locale).setLocaleTitle('AVATAR');

    switch (action) {
        case 'guild': {
            embed.setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));
            break;
        }

        case 'user': {
            embed.setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }));
            break;
        }
    }

    return embed;
}
