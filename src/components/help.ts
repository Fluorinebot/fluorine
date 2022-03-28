import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SelectMenuInteraction, EmbedFieldData, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { ChatInputCommand } from 'types/structures';

export const authorOnly = true;

export async function run(client: FluorineClient, interaction: SelectMenuInteraction) {
    const [category] = interaction.values;
    const commands = client.applicationCommands.chatInput.filter(
        (c: ChatInputCommand) => c.category === category && !c.dev
    );

    const fields: EmbedFieldData[] = commands.map(c => ({
        name: `/${c.data.name}`,
        value: c.data.description
    }));

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle(`HELP_TITLE_${category.toUpperCase()}`)
        .setFields(fields);

    const row = new MessageActionRow().addComponents([
        new MessageSelectMenu().setCustomId(`help:${interaction.user.id}`).setOptions([
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
