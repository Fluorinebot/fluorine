import AlcanClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import r from 'rethinkdb';
import { command } from 'types/command.type';
import category from '@util/category';

export async function run(
  client: AlcanClient,
  message: Message,
  args: string[]
) {
  const cmds = Array.from(client.cmds.values());
  const { prefix }: any = await r
    .table('config')
    .get(message.guild?.id)
    .run(client.conn);
  const list: any = {};
  ['fun', 'tools', 'moderation', 'dev'].forEach(key => {
    list[key] =
            cmds
              .filter((cmd: command) => cmd.help.category === key)
              .map(c => c.help.name)
              .join(' \n ') || 'None';
  });
  switch (args[0]) {
    case 'fun':
      const funEmbed = new Embed()
        .setTitle('4Fun')
        .setDescription(list.fun)
        .setFooter(client.footer);
      message.reply({ embeds: [funEmbed] });
      break;
    case 'tools':
      const toolEmbed = new Embed()
        .setTitle('Narzędzia')
        .setDescription(list.tools)
        .setFooter(client.footer);
      message.reply({ embeds: [toolEmbed] });
      break;
    case 'moderation':
      const modEmbed = new Embed()
        .setTitle('Moderacja')
        .setDescription(list.moderation)
        .setFooter(client.footer);

      message.reply({ embeds: [modEmbed] });
      break;
    case 'dev':
      break;
    default:
      if (client.cmds.get(args[0])) {
        const cmd = client.cmds.get(args[0]);
        const categorys = category(cmd);
        const helpEmbed = new Embed()
          .setTitle('Informacje o komendzie')
          .addField('Nazwa', cmd.help.name)
          .addField('Kategoria', categorys)
          .addField('Aliasy', cmd.help.aliases.toString() || 'Brak');
        message.reply({ embeds: [helpEmbed] });
      } else {
        const defaultEmbed = new Embed()
          .setTitle('Pomoc')
          .setDescription('Kategorie')
          .addField('4Fun', `${prefix}help fun`)
          .addField('Narzędzia', `${prefix}help tools`)
          .addField('Moderacja', `${prefix}help moderation`)
          .setFooter(client.footer);
        message.channel.send({ embeds: [defaultEmbed] });
        break;
      }
  }
}
export const help = {
  name: 'help',
  description: 'Lista komend',
  aliases: ['pomoc', 'h'],
  category: 'tools'
};
