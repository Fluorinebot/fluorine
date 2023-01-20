import { SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const value = interaction.options.getBoolean('logs');

    await client.prisma.config.update({
        where: {
            guildId: BigInt(interaction.guildId)
        },
        data: {
            logsEnabled: value
        }
    });

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('CONFIG_SET_SUCCESS_TITLE')
        .setDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_LOGS', { lng: interaction.locale }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandSubcommandBuilder('LOGS').addBooleanOption('LOGS', option =>
    option.setRequired(true)
);
