import { Embed, type FluorineClient } from '#classes';
import type { Category, ChatInputCommand, ComponentData } from '#types';
import {
    ActionRowBuilder,
    type APIEmbedField,
    type ChatInputCommandInteraction,
    SelectMenuBuilder,
    SlashCommandBuilder,
    type SelectMenuInteraction
} from 'discord.js';

export async function onInteraction(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction | SelectMenuInteraction
) {
    const [category] = interaction.isChatInputCommand()
        ? [interaction.options.getString('category')]
        : interaction.values;

    const commands = client.chatInput.filter((c: ChatInputCommand) => c.category === category && !c.dev);

    const fields: APIEmbedField[] = commands.map(c => ({
        name: `/${c.slashCommandData.name_localizations[interaction.locale] ?? c.slashCommandData.name}`,
        value: c.slashCommandData.description_localizations[interaction.locale] ?? c.slashCommandData.description
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

export const slashCommandData = new SlashCommandBuilder()
    .setName('help')
    .setNameLocalizations({ pl: 'pomoc' })
    .setDescription('Display the list of commands')
    .setDescriptionLocalizations({ pl: 'Wyświetl listę komend' })
    .addStringOption(option =>
        option
            .setName('category')
            .setNameLocalizations({ pl: 'kategoria' })
            .setDescription('The category to display')
            .setDescriptionLocalizations({ pl: 'Kategoria, którą chcesz wyświetlić' })
            .addChoices(
                {
                    name: 'Fun',
                    name_localizations: {
                        pl: 'Fun'
                    },
                    value: 'fun'
                },
                {
                    name: 'Tools',
                    name_localizations: {
                        pl: 'Narzędzia'
                    },
                    value: 'tools'
                },
                {
                    name: 'Moderation',
                    name_localizations: {
                        pl: 'Moderacja'
                    },
                    value: 'moderation'
                },
                {
                    name: 'Economy',
                    name_localizations: {
                        pl: 'Ekonomia'
                    },
                    value: 'economy'
                }
            )
            .setRequired(true)
    );

export const componentData: ComponentData = {
    exists: true,
    name: 'help',
    authorOnly: true
};

export const category: Category = 'tools';
