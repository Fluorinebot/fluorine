import { EmbedBuilder, SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const value = interaction.options.getString('currency');

    await client.prisma.config.update({
        where: {
            guildId: BigInt(interaction.guildId)
        },
        data: {
            currency: value
        }
    });

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('CONFIG_SET_SUCCESS_TITLE')
        .setDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_CURRENCY', { lng: interaction.locale }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandSubcommandBuilder('CURRENCY').addStringOption('CURRENCY', option =>
    option.setRequired(true)
);
