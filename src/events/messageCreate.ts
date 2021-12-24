import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import r from 'rethinkdb';
import { SettingsType } from 'types/settings.type';

export async function run(client: FluorineClient, message: Message) {
    if (message.channel.type === 'DM') {
        return message.reply(
            'Cześć! Komendy nie działają na prywatnych wiadomościach, spróbuj napisać `f!help` na serwerze na którym jestem.'
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
                .setTitle('Zwolnij!')
                .setDescription(
                    'Poczekaj 2 sekundy przed wykonaniem kolejnej komendy!'
                )
                .setFooter(client.footer);
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
            if (code.help.category !== 'dev') {
                client.statcord.postCommand(code.help.name, message.author.id);
            }
        } else {
            return message.react('❌');
        }
    } else if (message.content === `<@!${client.user.id}>`) {
        const embed = new Embed(client, message.guild.preferredLocale)
            .setTitle('Fluorine')
            .setDescription(
                `Cześć! Jestem Fluorine.\nMój prefix na tym serwerze to ${settings.prefix}`
            )
            .addField('Serwery', client.guilds.cache.size.toString())
            .addField('Użytkownicy', client.users.cache.size.toString())
            .addField('Komendy', client.cmds.size.toString())
            .addField('Kanały', client.channels.cache.size.toString())
            .setFooter(client.footer);
        message.channel.send({ embeds: [embed] });
    }
}
