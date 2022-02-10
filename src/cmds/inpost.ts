import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import { fetch } from 'undici';

export async function run(client: FluorineClient, message: Message, args: string[]) {
    if (!args[0]) {
        return message.reply(
            client.i18n.t('INPOST_ARGS', {
                lng: message.guild.preferredLocale
            })
        );
    }

    const statusURL = client.i18n.t('INPOST_URL', {
        lng: message.guild.preferredLocale
    });
    const statuses: any = await fetch(statusURL).then(res => res.json());
    const req: any = await fetch(`https://api-shipx-pl.easypack24.net/v1/tracking/${args[0]}`);
    const response = await req.json();
    if (req.status !== 200) {
        return message.reply(
            client.i18n.t('INPOST_NOT_FOUND', {
                lng: message.guild.preferredLocale,
                id: args[0]
            })
        );
    }
    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('INPOST_TITLE', {
            id: args[0]
        })
        .setColor('#ffcb39');

    if (response.custom_attributes.target_machine_detail.name) {
        embed.setLocaleDescription('INPOST_DESCRIPTION', response.custom_attributes.target_machine_detail);
    }
    response.tracking_details.reverse().forEach(data => {
        const statusObj = statuses.items.find(element => element.name === data.status);
        embed.addField(statusObj.title, statusObj.description);
    });
    message.reply({ embeds: [embed] });
}
