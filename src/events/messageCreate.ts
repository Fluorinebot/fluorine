import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message, MessageActionRow, MessageButton } from 'discord.js';

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

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift();

    if (message.content.startsWith(prefix)) {
        const chance = 5;
        const random = Math.floor(Math.random() * chance) + 1;

        if (random === 1) {
            const removalTimestamp = 1656676800;
            await client.application.fetch();
            message.channel.send({
                content: `<:SlashCommands:934768130474004500> **Use Slash Commands!**\nPrefix (message) commands are not supported and will be removed <t:${removalTimestamp}:R>! (<t:${removalTimestamp}:D>)\nIf you can't see Slash Commands, make sure to reinvite the bot`,
                components: [
                    new MessageActionRow().addComponents([
                        new MessageButton()
                            .setLabel('Bot Invite')
                            .setStyle('LINK')
                            .setURL(client.generateInvite(client.application.installParams)),
                        new MessageButton().setLabel('Support Server').setStyle('LINK').setURL(client.support)
                    ])
                ]
            });
        }

        const code = client.cmds.get(command);
        code?.run(client, message, args);
    } else if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) {
        const embed = new Embed(client, message.guild.preferredLocale).setDescription(
            "<:SlashCommands:934768130474004500> Fluorine now uses slash commands. Use `/help` to view my commands. If you can't see slash commands, re-invite the bot."
        );

        await client.application.fetch();

        message.channel.send({
            embeds: [embed],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton()
                        .setLabel('Bot Invite')
                        .setStyle('LINK')
                        .setURL(client.generateInvite(client.application.installParams)),
                    new MessageButton().setLabel('Support Server').setStyle('LINK').setURL(client.support)
                ])
            ]
        });
    }
}
