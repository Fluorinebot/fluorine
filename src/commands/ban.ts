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
            content: 'Nie masz permisji do zbanowania tego użytkownika!',
            ephemeral: true
        });
    }

    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? 'Brak powodu';

    if (!member)
        return interaction.reply({
            content: 'Członek którego chcesz zbanować nie istnieje!',
            ephemeral: true
        });

    if (!member.bannable)
        return interaction.reply({
            content:
                'Nie można zbanować tego członka, sprawdź czy bot posiada permisje',
            ephemeral: true
        });

    if (reason.length > 1024) {
        return interaction.reply({
            content: 'Powód nie może być dłuższy niż 1024',
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
        reason: `Zbanowano przez ${interaction.user.tag} | ${reason}`
    });
    modLog(client, create, interaction.guild);
    const embed = new Embed()
        .setTitle('Zbanowano!')
        .setDescription('Pomyślnie zbanowano członka!')
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addField('Zbanowany przez', interaction.user.tag)
        .addField('Zbanowany', member.user.tag)
        .addField('Powód', reason ?? 'Brak')
        .addField('ID kary', create.id.toString())
        .setFooter(client.footer);
    interaction.reply({ embeds: [embed] });

    r.table('case').insert(create).run(client.conn);
}
export const help = {
    name: 'ban',
    description: 'Zbanuj kogoś z serwera',
    aliases: ['zbanuj'],
    category: 'moderation'
};
