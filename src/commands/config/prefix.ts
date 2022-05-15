import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { Config } from 'types/databaseTables';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const prefix = interaction.options.getString('prefix');

    await client.db.query<Config>('UPDATE config SET prefix = $1 WHERE guild_id = $2', [
        prefix,
        BigInt(interaction.guildId)
    ]);

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_PREFIX', { lng: interaction.locale }),
            value: prefix
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
