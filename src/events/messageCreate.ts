import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import r from 'rethinkdb';
import { SettingsType } from 'types/settings.type';

export async function run(client: FluorineClient, message: Message) {
    if (message.channel.type === 'DM') {
        return message.reply(
            client.language.get(
                message.guild.preferredLocale,
                'MESSAGE_CREATE_DM'
            )
        );
    }
    // @ts-ignore
    const settings: SettingsType = await r
        .table('config')
        .get(message.guild?.id)
        .run(client.conn);
    const args = message.content.slice(settings.prefix.length).split(' ');
    const command = args.shift();

    if (message.content.startsWith(settings.prefix)) {
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
        if (code) {
            code.run(client, message, args);
        } else {
            return message.react('❌');
        }
    } else if (message.content === `<@!${client.user.id}>`) {
        const embed = new Embed(client, message.guild.preferredLocale)
            .setTitle('Fluorine')
            .setLocaleDescription('MESSAGE_CREATE_DESCRIPTION', {
                prefix: settings.prefix
            })
            .addLocaleField({
                name: 'STATS_SERVER_COUNT',
                value: client.guilds.cache.size.toString()
            })
            .addLocaleField({
                name: 'STATS_USER_COUNT',
                value: client.users.cache.size.toString()
            })
            .addLocaleField({
                name: 'STATS_COMMAND_COUNT',
                value: client.cmds.size.toString()
            })
            .addLocaleField({
                name: 'STATS_CHANNELS_COUNT',
                value: client.channels.cache.size.toString()
            })
            .setFooter(client.footer);
        message.channel.send({ embeds: [embed] });
    }
}
