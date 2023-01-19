import { SlashCommandBuilder } from '#builders';
import { Embed, type FluorineClient } from '#classes';
import type { Category, ChatInputCommand, ComponentData } from '#types';
import {
    ActionRowBuilder,
    type APIEmbedField,
    type ChatInputCommandInteraction,
    SelectMenuBuilder,
    type SelectMenuInteraction
} from 'discord.js';

export async function onInteraction(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction | SelectMenuInteraction
) {
    const [category] = interaction.isChatInputCommand()
        ? [interaction.options.getString('category')]
        : interaction.values;

    const commands = client.chatInputCommands.filter((c: ChatInputCommand) => c.category === category && !c.dev);

    const fields: APIEmbedField[] = commands.map(c => ({
        name: `/${
            c.slashCommandData.builder.name_localizations[interaction.locale] ?? c.slashCommandData.builder.name
        }`,
        value:
            c.slashCommandData.builder.description_localizations[interaction.locale] ??
            c.slashCommandData.builder.description
    }));

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle(`HELP_TITLE_${category.toUpperCase()}`)
        .setFields(fields);

    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents([
        new SelectMenuBuilder().setCustomId(`help:${interaction.user.id}`).setOptions([
            {
                label: client.i18n.t('FUN', { lng: interaction.locale }),
                value: 'fun',
                emoji: '🎮',
                default: category === 'fun'
            },
            {
                label: client.i18n.t('TOOLS', { lng: interaction.locale }),
                value: 'tools',
                emoji: '🛠️',
                default: category === 'tools'
            },
            {
                label: client.i18n.t('MODERATION', {
                    lng: interaction.locale
                }),
                value: 'moderation',
                emoji: '🔨',
                default: category === 'moderation'
            },
            {
                label: client.i18n.t('ECONOMY', {
                    lng: interaction.locale
                }),
                value: 'economy',
                emoji: '💰',
                default: category === 'economy'
            }
        ])
    ]);

    const options = {
        embeds: [embed],
        components: [row]
    };

    interaction.isChatInputCommand() ? interaction.reply(options) : interaction.update(options);
}

export const slashCommandData = new SlashCommandBuilder('HELP').addStringOption('CATEGORY', option =>
    option.addChoices('fun', 'tools', 'moderation', 'economy').setRequired(true)
);

export const componentData: ComponentData = {
    exists: true,
    name: 'help',
    authorOnly: true
};

export const category: Category = 'tools';
