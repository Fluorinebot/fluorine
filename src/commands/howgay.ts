import FluorineClient from '@classes/Client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/applicationCommand';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const percent = Math.floor(Math.random() * 100);
    const thing =
        interaction.options.resolved.users?.first() ??
        interaction.options.getString('thing') ??
        interaction.user;

    interaction.reply(
        client.language.get(interaction.locale, 'HOWGAY', {
            percent,
            thing
        })
    );
}

export const data = new SlashCommandBuilder()
    .setName('howgay')
    .setDescription('Check how gay something is')
    .addStringOption(option =>
        option
            .setName('thing')
            .setDescription('Provide a thing to check')
            .setRequired(false)
    );

export const category: Category = 'fun';
