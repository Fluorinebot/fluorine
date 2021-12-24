import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';

export async function run(client: FluorineClient, message: Message) {
    const embed = new Embed(client)
        .setTitle('Ping')
        .addField('Opóźnienie', `${client.ws.ping}ms`)
        .setFooter(client.footer);
    message.reply({ embeds: [embed] });
}
export const help = {
    name: 'ping',
    description: 'Opóźnienie pomiędzy discordem a botem',
    aliases: ['opoznienie', 'pong'],
    category: 'tools'
};
