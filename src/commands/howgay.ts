import { SlashCommandBuilder, ContextMenuCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import {
    ApplicationCommandType,
    type ChatInputCommandInteraction,
    type UserContextMenuCommandInteraction
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

export const slashCommandData = new SlashCommandBuilder('HOWGAY').addStringOption('THING');

export const contextMenuCommandData = new ContextMenuCommandBuilder(ApplicationCommandType.User, 'HOWGAY');

export const category: Category = 'fun';
