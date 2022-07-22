import FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, Interaction, User } from 'discord.js';

export function getComponents(
    client: FluorineClient,
    interaction: Interaction,
    member: GuildMember,
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
    member: GuildMember | User,
    action: 'guild' | 'user'
) {
    const embed = new Embed(client, interaction.locale).setLocaleTitle('AVATAR');

    if (member instanceof GuildMember) {
        switch (action) {
            case 'guild': {
                embed.setImage(member.displayAvatarURL({ size: 512 }));
                break;
            }

            case 'user': {
                embed.setImage(member.user.displayAvatarURL({ size: 512 }));
                break;
            }
        }
    } else {
        embed.setImage(member.displayAvatarURL({ size: 512 }));
    }

    return embed;
}
