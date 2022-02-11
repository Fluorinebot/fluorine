import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { MessageActionRow, MessageButton, ButtonInteraction, InteractionReplyOptions } from 'discord.js';

export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    const [memberID, action] = value.split('.');
    const member = await interaction.guild.members.fetch(memberID);

    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(`avatar:${interaction.user.id}:${member.id}.guild`)
            .setLabel(client.i18n.t('AVATAR_GUILD'))
            .setStyle('PRIMARY')
            .setDisabled(action === 'guild'),
        new MessageButton()
            .setCustomId(`avatar:${interaction.user.id}:${member.id}.user`)
            .setLabel(client.i18n.t('AVATAR_USER'))
            .setStyle('PRIMARY')
            .setDisabled(action === 'user')
    );

    let embed;

    switch (action) {
        case 'guild': {
            embed = new Embed(client, interaction.locale)
                .setLocaleTitle('AVATAR')
                .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));
            break;
        }

        case 'user': {
            embed = new Embed(client, interaction.locale)
                .setLocaleTitle('AVATAR')
                .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }));
        }
    }

    const replyOptions: InteractionReplyOptions = { components: [row], embeds: [embed] };
    interaction.update(replyOptions);
}

export const authorOnly = true;
