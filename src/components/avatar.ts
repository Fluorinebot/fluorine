import FluorineClient from '#classes/Client';
import { getComponents, getEmbed } from '#util/avatar';
import { ButtonInteraction } from 'discord.js';

export const authorOnly = true;

export async function run(client: FluorineClient, interaction: ButtonInteraction, value: string) {
    const [memberId, action] = value.split('.');
    const member = await interaction.guild.members.fetch(memberId);

    interaction.update({
        components: [getComponents(client, interaction, member, action as 'guild' | 'user')],
        embeds: [getEmbed(client, interaction, member, action as 'guild' | 'user')]
    });
}
