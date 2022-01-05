import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import { fetch } from 'undici';

export async function run(client: FluorineClient, message: Message) {
    const { file }: any = await (
        await fetch('https://api.alexflipnote.dev/dogs')
    ).json();
    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('DOG')
        .setImage(file);
    message.reply({ embeds: [embed] });
}
export const help = {
    name: 'birb',
    description: 'Random bird picture',
    category: '4fun'
};
