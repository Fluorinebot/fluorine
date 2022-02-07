import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import r from 'rethinkdb';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    if (!interaction.memberPermissions.has('MANAGE_GUILD')) {
        return interaction.reply({
            content: client.i18n.t('CONFIG_FAIL', { lng: interaction.locale }),
            ephemeral: true
        });
    }

    const prefix = interaction.options.getString('prefix');
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.i18n.t('CONFIG_PREFIX', { lng: interaction.locale }),
            value: prefix
        });
    interaction.reply({ embeds: [embed] });
    r.table('config')
        .get(interaction.guildId)
        .update({ prefix })
        .run(client.conn);
}
