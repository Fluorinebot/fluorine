import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import { Config } from 'types/databaseTables';

export async function run(client: FluorineClient, message: Message) {
    if (message.author.bot) {
        return;
    }

    const [settings] = (
        await client.db.query<Config>('SELECT antibot_factor, antibot_action, prefix FROM config WHERE guild_id = $1', [
            BigInt(message.guild.id)
        ])
    ).rows;

    if (settings.antibot_factor) {
        const factor = await client.phishing.messageAuthorIsBot(client, message);

        if (factor >= settings.antibot_factor) {
            message.delete();

            const caseObj = await client.cases.create(
                message.guildId,
                message.author,
                client.user,
                settings.antibot_action,
                client.i18n.t('ANTIBOT_REASON', {
                    lng: message.guild.preferredLocale,
                    factor
                })
            );

            switch (settings.antibot_action) {
                case 'kick': {
                    message.member.kick();
                    break;
                }

                case 'ban': {
                    message.member.ban();
                    break;
                }

                case 'timeout': {
                    message.member.timeout(
                        3600 * 24,
                        client.i18n.t('ANTIBOT_REASON', {
                            lng: message.guild.preferredLocale,
                            factor
                        })
                    );
                    break;
                }
            }

            client.cases.logToModerationChannel(message.guildId, caseObj);
        }
    }

    const args = message.content.slice(settings.prefix.length).split(' ');
    const command = args.shift();

    if (message.content.startsWith(settings.prefix)) {
        const random = Math.floor(Math.random() * 15) + 1;

        if (random === 15) {
            message.channel.send(
                '<:SlashCommands:934768130474004500> Use Slash Commands!\nPrefix commands are not supported and will be deleted in March!'
            );
        }

        if (client.cooldown.has(message.author.id)) {
            const coolEmbed = new Embed(client, message.guild.preferredLocale)
                .setLocaleTitle('MESSAGE_CREATE_COOLDOWN_TITLE')
                .setLocaleDescription('MESSAGE_CREATE_COOLDOWN_DESCRIPTION');
            return message.reply({ embeds: [coolEmbed] });
        }

        const code = client.cmds.get(command);

        if (code) {
            code.run(client, message, args);

            client.cooldown.add(message.author.id);
            setTimeout(() => {
                client.cooldown.delete(message.author.id);
            }, 1000);
        }
    } else if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) {
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
            });
        message.channel.send({ embeds: [embed] });
    }
}
