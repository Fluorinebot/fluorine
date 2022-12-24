import { SlashCommandSubcommandBuilder } from '#builders';
import { Embed, type FluorineClient } from '#classes';
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

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_CURRENCY', { lng: interaction.locale }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandSubcommandBuilder()
    .setName('CONFIG_CURRENCY_NAME')
    .setDescription('CONFIG_CURRENCY_DESCRIPTION')
    .addStringOption(option =>
        option
            .setName('CONFIG_CURRENCY_OPTION_CURRENCY_NAME')
            .setDescription('CONFIG_CURRENCY_OPTION_CURRENCY_DESCRIPTION')
            .setRequired(true)
    );
