import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { MessageActionRow, MessageButton, ButtonInteraction } from 'discord.js';

export const authorOnly = true;

export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    const [memberId, action] = value.split('.');
    const member = await interaction.guild.members.fetch(memberId);

    const row = new MessageActionRow().addComponents(
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

    interaction.update({ components: [row], embeds: [embed] });
}
