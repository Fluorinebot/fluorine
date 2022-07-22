import FluorineClient from '#classes/Client';
import { Category } from '#types/structures';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import hash from 'murmurhash-v3';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const thing =
        interaction.options.resolved.users?.first() ?? interaction.options.getString('thing') ?? interaction.user;

    const percent = ['<@478823932913516544>', '<@348591272476540928>'].includes(thing.toString())
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
    .setNameLocalizations({ pl: 'howgay' })
    .setDescription('Check how gay something is')
    .setDescriptionLocalizations({ pl: 'Sprawdź, jak gejowa jest jakaś rzecz' })
    .addStringOption(option =>
        option
            .setName('thing')
            .setNameLocalizations({ pl: 'rzecz' })
            .setDescription('Provide a thing to check')
            .setDescriptionLocalizations({ pl: 'Podaj rzecz, którą chcesz sprawdzić' })
            .setRequired(false)
    );

export const category: Category = 'fun';
