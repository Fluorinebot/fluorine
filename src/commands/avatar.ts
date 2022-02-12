import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction, GuildMember, InteractionReplyOptions, MessageActionRow, MessageButton } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction<'cached'>) {
    const member = interaction.options.getMember('user') ?? interaction.options.getUser('user') ?? interaction.member;

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('AVATAR')
        .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));

    const replyOptions: InteractionReplyOptions = { embeds: [embed] };

    if (member instanceof GuildMember && member.avatar) {
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
}

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show avatar of an user')
    .addUserOption(option => option.setName('user').setDescription('Select an user').setRequired(false));

export const category: Category = 'tools';
