import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { type ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const value = interaction.options.getString('action');

    await client.prisma.config.update({
        where: {
            guildId: BigInt(interaction.guildId)
        },
        data: {
            antibotAction: value
        }
    });

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_ANTIBOT_ACTION', {
                lng: interaction.locale
            }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('antibot-action')
    .setNameLocalizations({ pl: 'akcja-antybota' })
    .setDescription('Set antibot action')
    .setDescriptionLocalizations({ pl: 'Ustaw akcję antybota' })
    .addStringOption(option =>
        option
            .setName('action')
            .setNameLocalizations({ pl: 'akcja' })
            .setDescription('Action to do when antibot is triggered')
            .setDescriptionLocalizations({ pl: 'Akcja, którą ma zrobić antybot, gdy wykryje bota' })
            .addChoices(
                {
                    name: 'Ban',
                    name_localizations: {
                        pl: 'Ban'
                    },
                    value: 'ban'
                },
                {
                    name: 'Kick',
                    name_localizations: {
                        pl: 'Wyrzucenie '
                    },
                    value: 'kick'
                },
                {
                    name: 'Timeout',
                    name_localizations: {
                        pl: 'Przerwa'
                    },
                    value: 'timeout'
                }
            )
            .setRequired(true)
    );
