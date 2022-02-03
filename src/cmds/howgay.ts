import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';
import hash from 'murmurhash-v3';

export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (!args[0])
        return message.reply(
            client.i18n.t('HOWGAY_ARGS', {
                lng: message.guild.preferredLocale
            })
        );

    const thing = message.mentions.users.first() ?? args.join(' ');

    const percent = ['<@478823932913516544>', '<@348591272476540928>'].includes(
        thing.toString()
    )
        ? 100
        : hash(thing.toString()) % 101;

    message.reply(
        client.i18n.t('HOWGAY', {
            lng: message.guild.preferredLocale,
            percent,
            thing
        })
    );
}
export const help = {
    name: 'howgay',
    description: 'How gay',
    category: 'fun'
};
