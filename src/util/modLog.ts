import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Guild } from 'discord.js';
import r from 'rethinkdb';
import { Case } from 'types/case.type';
import { SettingsType } from 'types/settings.type';
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
    enum type {
        ban = 'Ban',
        kick = 'Wyrzucenie',
        warn = 'Warn',
        mute = 'Wyciszenie'
    }
    if (settings.modLogs && settings.logsChannel) {
        const creator = client.users.cache.get(Case.creator);
        const user = client.users.cache.get(Case.user);
        const embed = new Embed(client, guild.preferredLocale)
            .setTitle('Nowa kara!')
            .setDescription(`Powód: ${Case.dscp}`)
            .addField('ID', `#${Case.id}`)
            .addField('Moderator', creator.tag)
            .addField('Użytkownik', user.tag)
            .setThumbnail(user.displayAvatarURL())
            .setFooter(client.footer)
            // @ts-ignore
            .addField('Typ kary', type[Case.type]);
        const channel = client.channels.cache.get(settings.logsChannel);
        if (!channel.isText()) return;
        channel.send({ embeds: [embed] });
    }
}
