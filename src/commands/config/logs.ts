import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const value = interaction.options.getBoolean('logs');

    await client.prisma.config.update({
        where: {
            guildId: BigInt(interaction.guildId)
        },
        data: {
            logsEnabled: value
        }
    });

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_LOGS', { lng: interaction.locale }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('logs')
    .setNameLocalizations({ pl: 'logi' })
    .setDescription('Set if you want to log messages')
    .setDescriptionLocalizations({ pl: 'Ustaw, czy chcesz logować wiadomości na specjalnym kanale' })
    .addBooleanOption(option =>
        option
            .setName('logs')
            .setNameLocalizations({ pl: 'logi' })
            .setDescription('Set whether you want to log messages')
            .setDescriptionLocalizations({ pl: 'Ustaw, czy chcesz logować wiadomości' })
            .setRequired(true)
    );
