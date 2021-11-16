import AlcanClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';

export async function run(
  client: AlcanClient,
  message: Message
) {
  const embed = new Embed()
    .setTitle('Informacje o serwerze')
    .addField('Nazwa', message.guild?.name)
    .addField(
      'Data utworzenia', `<t:${Math.round(message.guild.createdTimestamp / 1000)}>`
    )
    .addField('Ilość członków', `${message.guild?.memberCount}`)
    .addField('Ilość kanałów', `${message.guild?.channels.cache.size}`)
    .addField('Ilość roli', `${message.guild?.roles.cache.size}`)
    .setFooter(client.footer);
  message.reply({ embeds: [embed] });
}
export const help = {
  name: 'serverinfo',
  description: 'Informacje o serwerze',
  aliases: ['server', 'si'],
  category: 'tools'
};
