import FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
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

export const data = new SlashCommandSubcommandBuilder()
    .setName('currency')
    .setDescription('Set the currency')
    .addStringOption(option =>
        option
            .setName('currency')
            .setNameLocalizations({ pl: 'waluta' })
            .setDescription('The currency you want to set')
            .setDescriptionLocalizations({ pl: 'Waluta, którą chcesz ustawić' })
            .setRequired(true)
    );
