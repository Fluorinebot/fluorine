import AlcanClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import r from 'rethinkdb';
import { SettingsType } from 'types/settings.type';
export async function run(client: AlcanClient, message: Message) {
  if (!message.content) return;
  // @ts-ignore
  const settings: SettingsType = await r
    .table('config')
    .get(message.guild?.id)
    .run(client.conn);
  if (!settings.logs || !settings.logsChannel) return;
  const channel = client.channels.cache.get(settings.logsChannel);
  if (!channel.isText()) return;
  const embed = new Embed()
    .setTitle('Usunięto wiadomość')
    .addField('Autor', message.author.tag)
    .addField('Treść', message.content);
  embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
  embed.setFooter(client.footer);
  channel?.send({ embeds: [embed] });
}
