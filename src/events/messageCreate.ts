import type FluorineClient from '#classes/Client';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type Message, OAuth2Scopes } from 'discord.js';

export async function run(client: FluorineClient, message: Message) {
    if (message.author.bot) {
        return;
    }

    const { prefix, antibotAction, antibotFactor } = await client.prisma.config.findUnique({
        where: {
            guildId: BigInt(message.guild.id)
        },
        select: {
            antibotFactor: true,
            antibotAction: true,
            prefix: true
        }
    });

    if (antibotFactor) {
        const factor = await client.phishing.messageAuthorIsBot(client, message);

        if (factor >= antibotFactor) {
            message.delete();

            const caseObj = await client.cases.create(
                message.guildId,
                message.author,
                client.user,
                antibotAction,
                client.i18n.t('ANTIBOT_REASON', {
                    lng: message.guild.preferredLocale,
                    factor
                })
            );

            switch (antibotAction) {
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

    if (message.content === `<@${client.user.id}>`) {
        return message.channel.send(client.i18n.t('MESSAGE_MENTION', { lng: message.guild.preferredLocale }));
    }

    const command = message.content.slice(prefix.length).split(' ').shift();

    if (!message.content.startsWith(prefix) || !client.commands.chatInput.has(command)) {
        return;
    }

    await client.application.fetch();
    message.channel.send({
        content: `<:SlashCommands:934768130474004500> **Use Slash Commands!**\nThis command can only be used via the Slash Command \`/${command}\`.\nIf you can't see Slash Commands, make sure to re-invite the bot`,
        components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents([
                new ButtonBuilder()
                    .setLabel('Bot Invite')
                    .setStyle(ButtonStyle.Link)
                    .setURL(client.generateInvite(client.application.installParams ?? { scopes: [OAuth2Scopes.Bot] })),
                new ButtonBuilder().setLabel('Support Server').setStyle(ButtonStyle.Link).setURL(client.support)
            ])
        ]
    });
}
