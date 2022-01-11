import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';
import { ChatInputCommandInteraction } from 'discord.js';
import createCase from '../util/createCase';
import r from 'rethinkdb';
import modLog from '@util/modLog';
export async function run(
    client: FluorineClient,
    interaction: ChatInputCommandInteraction<'cached'>
) {
    if (!interaction.member?.permissions.has('KICK_MEMBERS')) {
        return interaction.reply({
            content: client.language.get(
                interaction.guild.preferredLocale,
                'KICK_PERMISSIONS_MISSING'
            ),
            ephemeral: true
        });
    }

    const member = interaction.options.getMember('user');
    const reason =
        interaction.options.getString('reason') ??
        client.language.get(interaction.guild.preferredLocale, 'NO_REASON');

    if (!member)
        return interaction.reply({
            content: client.language.get(
                interaction.guild.preferredLocale,
                'KICK_MEMBER_MISSING'
            ),
            ephemeral: true
        });

    if (!member.kickable)
        return interaction.reply({
            content: client.language.get(
                interaction.guild.preferredLocale,
                'KICK_BOT_PERMISSIONS_MISSING'
            ),
            ephemeral: true
        });

    if (reason.length > 1024) {
        return interaction.reply({
            content: client.language.get(
                interaction.guild.preferredLocale,
                'REASON_LONGER_THAN_1024'
            ),
            ephemeral: true
        });
    }

    const create = await createCase(
        client,
        interaction?.guild,
        member.user,
        interaction.user,
        'kick',
        reason
    );

    await member.kick(
        client.language.get(interaction.guild.preferredLocale, 'KICK_REASON', {
            user: interaction.user.tag,
            reason
        })
    );
    modLog(client, create, interaction.guild);
    const embed = new Embed(client, interaction.guild.preferredLocale)
        .setLocaleTitle('KICK_SUCCESS_TITLE')
        .setLocaleDescription('KICK_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'KICK_MODERATOR', value: interaction.user.tag })
        .addLocaleField({ name: 'KICK_USER', value: member.user.tag })
        .addLocaleField({ name: 'REASON', value: reason })
        .addLocaleField({ name: 'PUNISHMENT_ID', value: create.id.toString() });
    interaction.reply({ embeds: [embed] });

    r.table('case').insert(create).run(client.conn);
}
export const help = {
    name: 'kick',
    description: 'Wyrzuć kogoś z serwera',
    aliases: ['wyrzuć'],
    category: 'moderation'
};
