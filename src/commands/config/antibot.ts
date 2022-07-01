import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const value = interaction.options.getInteger('factor');

    await client.prisma.config.update({
        where: {
            guildId: BigInt(interaction.guildId)
        },
        data: {
            antibotFactor: value
        }
    });

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_ANTIBOT', { lng: interaction.locale }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('antibot')
    .setNameLocalizations({ pl: 'antybot' })
    .setDescription('Set antibot factor! (Use 0 for disabled)')
    .setDescriptionLocalizations({ pl: 'Ustaw współczynnik antybota (użyj 0, by wyłączyć))' })
    .addIntegerOption(option =>
        option
            .setName('factor')
            .setNameLocalizations({ pl: 'współczynnik' })
            .setDescription('Antibot factor')
            .setDescriptionLocalizations({ pl: 'Współczynnik antybota' })
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)
    );
