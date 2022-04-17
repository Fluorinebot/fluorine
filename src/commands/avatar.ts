import FluorineClient from '@classes/Client';
import { CommandInteraction, GuildMember, InteractionReplyOptions } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';
import { getComponents, getEmbed } from '@util/avatar';

export async function run(client: FluorineClient, interaction: CommandInteraction<'cached'>) {
    const user = interaction.options.getMember('user') ?? interaction.options.getUser('user') ?? interaction.member;

    const replyOptions: InteractionReplyOptions = {
        embeds: [getEmbed(client, interaction, user, 'guild')]
    };

    if (user instanceof GuildMember && user.avatar) {
        replyOptions.components = [getComponents(client, interaction, user, 'guild')];
    }

    interaction.reply(replyOptions);
}

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Show avatar of a user')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Select a user')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(false)
    );

export const category: Category = 'tools';
