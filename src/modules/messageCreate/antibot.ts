import FluorineClient from '@classes/Client';
import caseCreate from 'utils/createCase';
import { messageBot } from 'utils/messageBot';
import modLog from 'utils/modLog';
import { Message } from 'discord.js';
import r from 'rethinkdb';
import { SettingsType } from 'types/settings';
export async function run(client: FluorineClient, message: Message) {
    const settings = (await r
        .table('config')
        .get(message.guild?.id)
        .run(client.conn)) as SettingsType;
    if (settings.antibot) {
        const factor = await messageBot(client, message);
        if (factor >= settings.antibot) {
            message.delete();
            const Case = await caseCreate(
                client,
                message.guild,
                message.author,
                client.user,
                settings.antibotAction,
                client.i18n.t('ANTIBOT_REASON', {
                    lng: message.guild.preferredLocale,
                    factor
                })
            );
            switch (settings.antibotAction) {
                case 'kick':
                    message.member.kick();
                    break;
                case 'ban':
                    message.member.ban();
                    break;
                case 'mute':
                    if (settings.muteRole) {
                        message.member.roles.add(settings.muteRole);
                    }
                    break;
            }
            modLog(client, Case, message.guild);
        }
    }
}
