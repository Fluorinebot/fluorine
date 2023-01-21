import { EmbedBuilder, SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const value = interaction.options.getBoolean('mod-logs');

    await client.prisma.config.update({
        where: {
            guildId: BigInt(interaction.guildId)
        },
        data: {
            logModerationActions: value
        }
    });

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('CONFIG_SET_SUCCESS_TITLE')
        .setDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_MODLOG', { lng: interaction.locale }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandSubcommandBuilder('MOD_LOGS').addBooleanOption('MOD_LOGS', option =>
    option.setRequired(true)
);
