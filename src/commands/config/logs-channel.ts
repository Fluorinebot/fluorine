import { SlashCommandSubcommandBuilder } from '#builders';
import { Embed, type FluorineClient } from '#classes';
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

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_LOGS_CHANNEL', {
                lng: interaction.locale
            }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandSubcommandBuilder()
    .setName('CONFIG.LOGS_CHANNEL.NAME')
    .setDescription('CONFIG.LOGS_CHANNEL.DESCRIPTION')
    .addChannelOption(option =>
        option
            .setName('CONFIG.LOGS_CHANNEL.OPTIONS.CHANNEL.NAME')
            .setDescription('CONFIG.LOGS_CHANNEL.LOGS.OPTIONS.CHANNEL.DESCRIPTION')
            .setChannelTypes(ChannelType.GuildText)
            .setRequired(true)
    );
