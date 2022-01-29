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
            content: client.language.get(interaction.locale, 'CONFIG_FAIL'),
            ephemeral: true
        });
    }
    const value = interaction.options.getString('currency');
    const guildId = interaction.guild.id;
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('CONFIG_SET_SUCCESS_TITLE')
        .setLocaleDescription('CONFIG_SET_SUCCESS_DESCRIPTION', {
            key: client.language.get(interaction.locale, 'CONFIG_CURRENCY'),
            value
        });
    interaction.reply({ embeds: [embed] });
    r.table('config').get(guildId).update({ currency: value }).run(client.conn);
}
