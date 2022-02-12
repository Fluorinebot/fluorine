import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction, InteractionReplyOptions, MessageActionRow, MessageButton } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction<'cached'>) {
    const member = interaction.options.getMember('user');
    const user = interaction.options.getUser('user');
    const author = interaction.member;

    if (member) {
        const embed = new Embed(client, interaction.locale)
            .setLocaleTitle('AVATAR')
            .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));

        const replyOptions: InteractionReplyOptions = { embeds: [embed] };

        if (member.avatar) {
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`avatar:${interaction.user.id}:${member.id}.guild`)
                    .setLabel(client.i18n.t('AVATAR_GUILD'))
                    .setDisabled(true)
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(`avatar:${interaction.user.id}:${member.id}.user`)
                    .setLabel(client.i18n.t('AVATAR_USER'))
                    .setStyle('PRIMARY')
            );

            replyOptions.components = [row];
        }

        interaction.reply(replyOptions);
    } else if (user) {
        const embed = new Embed(client, interaction.locale)
            .setLocaleTitle('AVATAR')
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }));
        interaction.reply({ embeds: [embed] });
    } else {
        const embed = new Embed(client, interaction.locale)
            .setLocaleTitle('AVATAR')
            .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));

        const replyOptions: InteractionReplyOptions = { embeds: [embed] };

        if (author.avatar) {
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`avatar:${interaction.user.id}:${author.id}.guild`)
                    .setLabel(client.i18n.t('AVATAR_GUILD'))
                    .setDisabled(true)
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(`avatar:${interaction.user.id}:${author.id}.user`)
                    .setLabel(client.i18n.t('AVATAR_USER'))
                    .setStyle('PRIMARY')
            );

            replyOptions.components = [row];
        }
    }
}

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show avatar of an user')
    .addUserOption(option => option.setName('user').setDescription('Select an user').setRequired(false));

export const category: Category = 'tools';
