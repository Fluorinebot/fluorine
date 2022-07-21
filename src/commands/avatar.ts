import FluorineClient from '@classes/Client';
import { ChatInputCommandInteraction, GuildMember, InteractionReplyOptions, SlashCommandBuilder } from 'discord.js';
import { Category } from 'types/structures';
import { getComponents, getEmbed } from '@util/avatar';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction<'cached'>) {
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
    .setNameLocalizations({ pl: 'avatar' })
    .setDescription('Show avatar of a user')
    .setDescriptionLocalizations({ pl: 'Wyświetla avatar użytkownika' })
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'użytkownik' })
            .setDescription('Select a user')
            .setDescriptionLocalizations({ pl: 'Wybierz użytkownika' })
            .setRequired(false)
    );

export const category: Category = 'tools';
