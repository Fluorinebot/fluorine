import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    const responses = client.language.get(
        message.guild.preferredLocale,
        '8BALL_RESPONSES'
    );
    if (!args[0]) {
        return message.reply(
            client.language.get(message.guild.preferredLocale, '8BALL_ERROR')
        );
    }

    const embed = new Embed(client, message.guild.preferredLocale)
        .setDescription(args.join(' '))
        .setFooter(client.footer)
        .addLocaleField({
            name: '8BALL_RESPONSE',
            value: responses[Math.floor(Math.random() * responses.length)]
        });
    message.reply({ embeds: [embed] });
}
export const help = {
    name: '8ball',
    description: 'Magiczna kula',
    aliases: [],
    category: 'fun'
};
