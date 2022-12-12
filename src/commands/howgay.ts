import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import {
    ApplicationCommandType,
    type ChatInputCommandInteraction,
    type UserContextMenuCommandInteraction,
    ContextMenuCommandBuilder,
    SlashCommandBuilder
} from 'discord.js';
import hash from 'murmurhash-v3';

export async function onCommand(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction
) {
    let thing;

    if (interaction.isChatInputCommand()) {
        thing =
            interaction.options.resolved.users?.first() ?? interaction.options.getString('thing') ?? interaction.user;
    } else {
        thing = interaction.targetUser;
    }

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

export const slashCommandData = new SlashCommandBuilder()
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

export const contextMenuCommandData = new ContextMenuCommandBuilder()
    .setName('How Gay')
    .setNameLocalizations({ pl: 'How Gay' })
    .setType(ApplicationCommandType.User);

export const category: Category = 'fun';
