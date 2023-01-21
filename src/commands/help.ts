import { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category, ChatInputCommand, ComponentData, LocaleFieldOptions } from '#types';
import { type ChatInputCommandInteraction, type SelectMenuInteraction } from 'discord.js';

export async function onInteraction(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction | SelectMenuInteraction
) {
    const [category] = interaction.isChatInputCommand()
        ? [interaction.options.getString('category')]
        : interaction.values;

    const commands = client.chatInputCommands.filter((c: ChatInputCommand) => c.category === category && !c.dev);

    const fields: LocaleFieldOptions[] = commands.map(c => ({
        rawName: `/${
            c.slashCommandData.builder.name_localizations[interaction.locale] ?? c.slashCommandData.builder.name
        }`,
        rawValue:
            c.slashCommandData.builder.description_localizations[interaction.locale] ??
            c.slashCommandData.builder.description
    }));

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle(`HELP_TITLE_${category.toUpperCase()}`)
        .setFields(...fields);

    const row = new ActionRowBuilder(interaction.locale).addComponents(
        new SelectMenuBuilder(`help:${interaction.user.id}`).setOptions(
            { label: 'FUN', value: 'fun', emoji: '🎮', default: category === 'fun' },
            { label: 'TOOLS', value: 'tools', emoji: '🛠️', default: category === 'tools' },
            { label: 'MODERATION', value: 'moderation', emoji: '🔨', default: category === 'moderation' },
            { label: 'ECONOMY', value: 'economy', emoji: '💰', default: category === 'economy' }
        )
    );

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
