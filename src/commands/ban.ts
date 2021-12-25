import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';
import { CommandInteraction } from 'discord.js';
import createCase from '../util/createCase';
import r from 'rethinkdb';
import modLog from '@util/modLog';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction<'cached'>
) {
    if (!interaction.member?.permissions.has('BAN_MEMBERS')) {
        return interaction.reply({
            content: client.language.get(
                interaction.guild.preferredLocale,
                'BAN_PERMISSIONS_MISSING'
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
                'BAN_MEMBER_MISSING'
            ),
            ephemeral: true
        });

    if (!member.bannable)
        return interaction.reply({
            content: client.language.get(
                interaction.guild.preferredLocale,
                'BAN_BOT_PERMISSIONS_MISSING'
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
        'ban',
        reason
    );

    await member.ban({
        reason: client.language.get(
            interaction.guild.preferredLocale,
            'BAN_REASON',
            {
                user: interaction.user.tag,
                reason
            }
        )
    });
    modLog(client, create, interaction.guild);
    const embed = new Embed(client, interaction.guild.preferredLocale)
        .setLocaleTitle('BAN_SUCCESS_TITLE')
        .setLocaleDescription('BAN_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'BAN_MODERATOR', value: interaction.user.tag })
        .addLocaleField({ name: 'BAN_USER', value: member.user.tag })
        .addLocaleField({ name: 'REASON', value: reason })
        .addLocaleField({ name: 'PUNISHMENT_ID', value: create.id.toString() });
    interaction.reply({ embeds: [embed] });

    r.table('case').insert(create).run(client.conn);
}
export const help = {
    name: 'ban',
    description: 'Zbanuj kogoś z serwera',
    aliases: ['zbanuj'],
    category: 'moderation'
};
