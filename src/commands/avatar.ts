import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { getAvatarComponents, getAvatarEmbed } from '#util';
import {
    type ChatInputCommandInteraction,
    GuildMember,
    type InteractionReplyOptions,
    SlashCommandBuilder
} from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction<'cached'>) {
    const user = interaction.options.getMember('user') ?? interaction.options.getUser('user') ?? interaction.member;

    const replyOptions: InteractionReplyOptions = {
        embeds: [getAvatarEmbed(client, interaction, user, 'guild')]
    };

    if (user instanceof GuildMember && user.avatar) {
        replyOptions.components = [getAvatarComponents(client, interaction, user, 'guild')];
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
