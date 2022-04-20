import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';

export async function run(client: FluorineClient, message: Message) {
    const { file }: any = await (await fetch('https://api.alexflipnote.dev/cats')).json();
    const embed = new Embed(client, message.guild.preferredLocale).setLocaleTitle('CAT').setImage(file);
    message.reply({ embeds: [embed] });
}
