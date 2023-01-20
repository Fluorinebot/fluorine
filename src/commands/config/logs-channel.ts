import { SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import { type ChatInputCommandInteraction, ChannelType } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const value = interaction.options.getChannel('channel').id;

    await client.prisma.config.update({
        where: {
            guildId: BigInt(interaction.guildId)
        },
        data: {
            logsChannel: BigInt(value)
        }
    });

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('CONFIG_SET_SUCCESS_TITLE')
        .setDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_LOGS_CHANNEL', {
                lng: interaction.locale
            }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandSubcommandBuilder('CHANNEL').addChannelOption('CHANNEL', option =>
    option.setChannelTypes(ChannelType.GuildText).setRequired(true)
);
