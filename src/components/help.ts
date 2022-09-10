import { Embed, type FluorineClient } from '#classes';
import type { ChatInputCommand } from '#types';
import { ActionRowBuilder, type APIEmbedField, SelectMenuBuilder, type SelectMenuInteraction } from 'discord.js';

export const authorOnly = true;

export async function run(client: FluorineClient, interaction: SelectMenuInteraction) {
    const [category] = interaction.values;
    const commands = client.commands.chatInput.filter((c: ChatInputCommand) => c.category === category && !c.dev);

    const fields: APIEmbedField[] = commands.map(c => ({
        name: `/${c.data.name_localizations[interaction.locale] ?? c.data.name}`,
        value: c.data.description_localizations[interaction.locale] ?? c.data.description
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

    interaction.update({
        embeds: [embed],
        components: [row]
    });
}
