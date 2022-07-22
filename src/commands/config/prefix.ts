import FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const value = interaction.options.getString('prefix');

    await client.prisma.config.update({
        where: {
            guildId: BigInt(interaction.guildId)
        },
        data: {
            prefix: value
        }
    });

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_PREFIX', { lng: interaction.locale }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('prefix')
    .setNameLocalizations({ pl: 'prefix' })
    .setDescription('Set the prefix for your guild')
    .setDescriptionLocalizations({ pl: 'Ustaw prefix bota na twoim serwerze' })
    .addStringOption(option =>
        option
            .setName('prefix')
            .setNameLocalizations({ pl: 'prefix' })
            .setDescription('The prefix you want to set')
            .setDescriptionLocalizations({ pl: 'Prefix, który chcesz ustawić' })
            .setRequired(true)
    );
