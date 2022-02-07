import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import r from 'rethinkdb';
import { SettingsType } from 'types/settings';
export async function run(client: FluorineClient, message: Message) {
    const settings = (await r
        .table('config')
        .get(message.guild?.id)
        .run(client.conn)) as SettingsType;

    if (!message.content.startsWith(settings.prefix)) {
        return;
    }
    const args = message.content.slice(settings.prefix.length).split(' ');
    const command = args.shift();
    if (client.cooldown.has(message.author.id)) {
        const coolEmbed = new Embed(client, message.guild.preferredLocale)
            .setLocaleTitle('MESSAGE_CREATE_COOLDOWN_TITLE')
            .setLocaleDescription('MESSAGE_CREATE_COOLDOWN_DESCRIPTION');
        return message.reply({ embeds: [coolEmbed] });
    }

    client.cooldown.add(message.author.id);

    if (message.author.id !== '817883855310684180') {
        setTimeout(() => {
            client.cooldown.delete(message.author.id);
        }, 2000);
    }

    const code = client.cmds.get(command);
    if (!code) return message.react('❌');

    const random = Math.floor(Math.random() * 20) + 1;
    if (random === 20)
        message.channel.send(
            '<:SlashCommands:934768130474004500> Use Slash Commands!\nFluorine will stop responding to prefix commands soon!'
        );

    code.run(client, message, args);
}
