import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Guild } from 'discord.js';
import r from 'rethinkdb';
import { Case } from 'types/case';
import { SettingsType } from 'types/settings';
export default async function modLog(
    client: FluorineClient,
    Case: Case,
    guild: Guild
) {
    // @ts-ignore
    const settings: SettingsType = await r
        .table('config')
        .get(guild.id)
        .run(client.conn);

    if (settings.modLogs && settings.logsChannel) {
        const creator = client.users.cache.get(Case.creator);
        const user = client.users.cache.get(Case.user);
        const embed = new Embed(client, guild.preferredLocale)
            .setLocaleTitle('CASE_NEW')
            .setThumbnail(user.displayAvatarURL())
            .addLocaleField({ name: 'REASON', value: Case.dscp })
            .addField('ID', `#${Case.id}`)
            .addLocaleField({ name: 'CASE_MODERATOR', value: creator.tag })
            .addLocaleField({ name: 'CASE_USER', value: user.tag })
            .addLocaleField({
                name: 'CASE_TYPE',
                localeValue: Case.type.toUpperCase() as
                    | 'BAN'
                    | 'KICK'
                    | 'WARN'
                    | 'MUTE'
            });

        const channel = client.channels.cache.get(settings.logsChannel);
        if (!channel.isText()) return;
        channel.send({ embeds: [embed] });
    }
}
