import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import type { ChatInputCommand } from '#types/structures';
import { ActionRowBuilder, SelectMenuBuilder } from '@discordjs/builders';
import type { APIEmbedField } from 'discord-api-types/v10';
import { type SelectMenuInteraction } from 'tiscord';

export const authorOnly = true;

export async function run(client: FluorineClient, interaction: SelectMenuInteraction) {
    const [category] = interaction.values;
    const commands = [...client.commands.chatInput.values()].filter(
        (c: ChatInputCommand) => c.category === category && !c.dev
    );

    const fields: APIEmbedField[] = commands.map(c => ({
        name: `/${c.data.name_localizations[interaction.locale] ?? c.data.name}`,
        value: c.data.description_localizations[interaction.locale] ?? c.data.description
    }));

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle(`HELP_TITLE_${category.toUpperCase()}`)
        .setFields(fields);

    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents([
        // @ts-expect-error
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

    interaction.editOriginalMessage({
        embeds: [embed.toJSON()],
        components: [row]
    });
}
