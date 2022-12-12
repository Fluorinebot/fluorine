import { Embed, type FluorineClient } from '#classes';
import { type ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

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

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_MODLOG', { lng: interaction.locale }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandSubcommandBuilder()
    .setName('mod-logs')
    .setNameLocalizations({ pl: 'mod-logi' })
    .setDescription('Set if you want to log moderation actions')
    .setDescriptionLocalizations({ pl: 'Ustaw, czy chcesz, by logować akcje moderacyjne' })
    .addBooleanOption(option =>
        option
            .setName('mod-logs')
            .setNameLocalizations({ pl: 'mod-logi' })
            .setDescription('Set whether you want to log moderation actions')
            .setDescriptionLocalizations({ pl: 'Ustaw, czy chcesz, by logować akcje moderacyjne' })
            .setRequired(true)
    );
