import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v10';
import { Config } from 'types/databaseTables';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const value = interaction.options.getChannel('channel').id;

    await client.db.query<Config>('UPDATE config SET logs_channel = $1 WHERE guild_id = $2', [
        BigInt(value),
        BigInt(interaction.guildId)
    ]);

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

export const data = new SlashCommandSubcommandBuilder()
    .setName('logs-channel')
    .setNameLocalizations({ pl: 'kanał-logów' })
    .setDescription('Set the channel for logs')
    .setDescriptionLocalizations({ pl: 'Ustaw kanał, na którym pojawiają się logi' })
    .addChannelOption(option =>
        option
            .setName('channel')
            .setNameLocalizations({ pl: 'kanał' })
            .setDescription('Channel for logs')
            .setDescriptionLocalizations({ pl: 'Kanał z logami' })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
    );
