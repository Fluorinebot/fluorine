import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { Config } from 'types/databaseTables';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    if (!interaction.memberPermissions.has('MANAGE_GUILD')) {
        return interaction.reply({
            content: client.i18n.t('CONFIG_FAIL', { lng: interaction.locale }),
            ephemeral: true
        });
    }

    const value = interaction.options.getString('action');

    await client.db.query<Config>('UPDATE config SET antibot_action = $1 WHERE guild_id = $2', [
        value,
        BigInt(interaction.guildId)
    ]);

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_ANTIBOT_ACTION', {
                lng: interaction.locale
            }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('antibot-action')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Set antibot action')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addStringOption(option =>
        option
            .setName('action')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Action to do when antibot is triggered')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .addChoices(
                {
                    name: 'Ban',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'ban'
                },
                {
                    name: 'Kick',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'kick'
                },
                {
                    name: 'Timeout',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'timeout'
                }
            )
            .setRequired(true)
    );
