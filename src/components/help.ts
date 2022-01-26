import FluorineClient from '@classes/Client';
import { LanguageStrings } from 'types/language';
import Embed from '@classes/Embed';
import {
    SelectMenuInteraction,
    EmbedFieldData,
    MessageActionRow,
    MessageSelectMenu
} from 'discord.js';

export const authorOnly = true;

export async function run(
    client: FluorineClient,
    interaction: SelectMenuInteraction
) {
    const [category] = interaction.values;
    const commands = client.applicationCommands.filter(
        c => c.category === category && !c.dev
    );

    const fields: EmbedFieldData[] = commands.map(c => ({
        name: `/${c.data.name}`,
        value: c.data.description
    }));

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle(
            `HELP_TITLE_${category.toUpperCase()}` as LanguageStrings
        )
        .setFields(fields);

    const row = new MessageActionRow().addComponents([
        new MessageSelectMenu()
            .setCustomId(`help:${interaction.user.id}`)
            .setOptions([
                {
                    label: client.language.get(interaction.locale, 'FUN'),
                    value: 'fun',
                    emoji: '🎮',
                    default: category === 'fun'
                },
                {
                    label: client.language.get(interaction.locale, 'TOOLS'),
                    value: 'tools',
                    emoji: '🛠️',
                    default: category === 'tools'
                },
                {
                    label: client.language.get(
                        interaction.locale,
                        'MODERATION'
                    ),
                    value: 'moderation',
                    emoji: '🔨',
                    default: category === 'moderation'
                },
                {
                    label: client.language.get(interaction.locale, 'ECONOMY'),
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
