import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import { fetch } from 'undici';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (!args[0]) {
        return message.reply(
            client.language.get(message.guild.preferredLocale, 'INPOST_ARGS')
        );
    }
    let statusURL;
    if (message.guild.preferredLocale === 'pl') {
        statusURL = 'https://api-shipx-pl.easypack24.net/v1/statuses';
    } else {
        statusURL = 'https://api-shipx-pl.easypack24.net/v1/statuses?lang=en';
    }
    const statuses: any = await fetch(statusURL).then(res => res.json());
    const req: any = await fetch(
        `https://api-shipx-pl.easypack24.net/v1/tracking/${args[0]}`
    );
    const response = await req.json();
    if (req.status !== 200) {
        return message.reply(
            client.language.get(
                message.guild.preferredLocale,
                'INPOST_NOT_FOUND',
                { id: args[0] }
            )
        );
    }
    const embed = new Embed(client, message.guild.preferredLocale)
        .setTitle(
            client.language.get(message.guild.preferredLocale, 'INPOST_TITLE', {
                id: args[0]
            })
        )
        .setColor('#ffcb39');
    console.log(response);
    if (response.custom_attributes.target_machine_detail.name) {
        embed.setDescription(
            client.language.get(
                message.guild.preferredLocale,
                'INPOST_DESCRIPTION',
                response.custom_attributes.target_machine_detail
            )
        );
    }
    response.tracking_details.reverse().forEach((data: any) => {
        const statusObj = statuses.items.find(
            element => element.name === data.status
        );
        embed.addField(statusObj.title, statusObj.description);
    });
    message.reply({ embeds: [embed] });
}
