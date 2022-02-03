import FluorineClient from '@classes/Client';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/applicationCommand';
import hash from 'murmurhash-v3';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const thing =
        interaction.options.resolved.users?.first() ??
        interaction.options.getString('thing') ??
        interaction.user;

    const percent = ['<@478823932913516544>', '<@348591272476540928>'].includes(
        thing.toString()
    )
        ? 100
        : hash(thing.toString()) % 101;

    interaction.reply(
        client.i18n.t('HOWGAY', {
            lng: interaction.locale,
            percent,
            thing: thing.toString()
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
