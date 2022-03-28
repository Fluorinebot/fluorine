import FluorineClient from '@classes/Client';
import { CommandInteraction, GuildMember, InteractionReplyOptions } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';
import { getComponents, getEmbed } from '@util/avatar';

export async function run(client: FluorineClient, interaction: CommandInteraction<'cached'>) {
    const user = interaction.options.getMember('user') ?? interaction.options.getUser('user') ?? interaction.member;

    const replyOptions: InteractionReplyOptions = {
        embeds: [getEmbed(client, interaction, user as unknown as GuildMember, 'guild')]
    };

    if (user instanceof GuildMember && user.avatar) {
        replyOptions.components = [getComponents(client, interaction, user, 'guild')];
    }

    interaction.reply(replyOptions);
}

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show avatar of an user')
    .addUserOption(option => option.setName('user').setDescription('Select an user').setRequired(false));

export const category: Category = 'tools';
