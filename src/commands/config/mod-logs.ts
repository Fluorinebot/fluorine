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

    const value = interaction.options.getBoolean('mod-logs');

    await client.db.query<Config>('UPDATE config SET log_moderation_actions = $1 WHERE guild_id = $2', [
        value,
        BigInt(interaction.guildId)
    ]);

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_MODLOG', { lng: interaction.locale }),
            value
        });

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('mod-logs')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Set if you want to log moderation actions')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addBooleanOption(option =>
        option
            .setName('mod-logs')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Set whether you want to log moderation actions')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    );
