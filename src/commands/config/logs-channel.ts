import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v9';
import { Config } from 'types/databaseTables';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    if (!interaction.memberPermissions.has('MANAGE_GUILD')) {
        return interaction.reply({
            content: client.i18n.t('CONFIG_FAIL', { lng: interaction.locale }),
            ephemeral: true
        });
    }

    const value = interaction.options.getChannel('channel').id;

    await client.db.query<Config>('UPDATE config SET logs_channel = $1 WHERE guild_id = $2', [
        BigInt(value),
        BigInt(interaction.guild.id)
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
    .setDescription('Set the channel for logs')
    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Channel for logs')
            .addChannelType(ChannelType.GuildText)
            .setRequired(true)
    );
