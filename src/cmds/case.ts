import AlcanClient from '../classes/Client';
import Embed from '../classes/Embed';
import { Message } from 'discord.js';
import getCase from '@util/getCase';
export async function run(
  client: AlcanClient,
  message: Message,
  args: Array<string>
) {
  enum Type {
    ban = 'Ban',
    kick = 'Wyrzucenie',
    warn = 'Warn',
    mute = 'Wyciszenie',
  }
  if (!args[0]) return message.reply('Musisz podać ID kary!');
  const caseArray = await getCase(client, message.guild, parseInt(args[0]));
  const [Case] = caseArray;
  if (!Case) return message.reply('Nie istnieje kara o tym ID');
  const user = client.users.cache.get(Case.user);
  const creator = client.users.cache.get(Case.creator);
  const embed = new Embed()
    .setTitle('Kara')
    .setThumbnail(user?.displayAvatarURL({ dynamic: true }))
    .addField('Ukarany', user?.tag || 'Nie znaleziono')
    .addField('Ukarany przez', creator?.tag || 'Nie znaleziono')
  // @ts-ignore
    .addField('Typ kary', Type[Case.type])
    .addField('Powód', Case.dscp)
    .setFooter(client.footer);
  message.reply({ embeds: [embed] });
}
export const help = {
  name: 'case',
  description: 'Sprawdź informacje o karze.',
  aliases: ['kara'],
  category: 'mod'
};
