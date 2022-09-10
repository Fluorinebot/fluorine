import type { FluorineClient } from '#classes';
import { getAvatarComponents, getAvatarEmbed } from '#util';
import type { ButtonInteraction } from 'discord.js';

export const authorOnly = true;

export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    const [memberId, action] = value.split('.');
    const member = await interaction.guild.members.fetch(memberId);

    interaction.update({
        components: [getAvatarComponents(client, interaction, member, action as 'guild' | 'user')],
        embeds: [getAvatarEmbed(client, interaction, member, action as 'guild' | 'user')]
    });
}
