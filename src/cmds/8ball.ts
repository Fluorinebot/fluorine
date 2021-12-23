import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    const responses = client.language.get('pl', '8BALL_RESPONSES');
    if (!args[0]) {
        return message.reply(client.language.get('pl', '8BALL_ERROR'));
    }

    const embed = new Embed()
        .setDescription(args.join(' '))
        .setFooter(client.footer)
        .addField(
            client.language.get('pl', '8BALL_RESPONSE'),
            responses[Math.floor(Math.random() * responses.length)]
        );
    message.reply({ embeds: [embed] });
}
export const help = {
    name: '8ball',
    description: 'Magiczna kula',
    aliases: [],
    category: 'fun'
};
