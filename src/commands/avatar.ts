import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction<'cached'>
) {
    const member = interaction.options.getMember('user') ?? interaction.member;

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('AVATAR')
        .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show avatar of an user')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('Select an user')
            .setRequired(false)
    );

export const category = 'tools';
