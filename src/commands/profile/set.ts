import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import r from 'rethinkdb';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const profile = await r.table('profile').get(interaction.user.id).run(client.conn);
    const field = interaction.options.getString('field');
    const value = interaction.options.getString('value');
    switch (field) {
        case 'location':
            if (value.length > 15 || value.length < 3) {
                return interaction.reply({
                    content: client.i18n.t('PROFILE_INVALID_LOCATION', {
                        lng: interaction.locale
                    }),
                    ephemeral: true
                });
            }
            if (profile) {
                await r.table('profile').get(interaction.user.id).update({ location: value }).run(client.conn);
            } else {
                await r
                    .table('profile')
                    .insert({
                        id: interaction.user.id,
                        location: value
                    })
                    .run(client.conn);
            }
            const locEmbed = new Embed(client, interaction.locale)
                .setLocaleTitle('PROFILE_SUCCESS')
                .setLocaleDescription('PROFILE_SET_LOCATION', {
                    value
                });
            interaction.reply({ embeds: [locEmbed], ephemeral: true });
            break;
        case 'website':
            const website = value;
            const regex =
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,20}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gu;
            if (!website.match(regex)) {
                return interaction.reply(
                    client.i18n.t('PROFILE_INVALID_WEBSITE', {
                        lng: interaction.locale
                    })
                );
            }
            if (profile) {
                await r.table('profile').get(interaction.user.id).update({ website }).run(client.conn);
            } else {
                await r
                    .table('profile')
                    .insert({
                        id: interaction.user.id,
                        website
                    })
                    .run(client.conn);
            }
            const webEmbed = new Embed(client, interaction.locale)
                .setLocaleTitle('PROFILE_SUCCESS')
                .setLocaleDescription('PROFILE_SET_WEBSITE', { website });
            interaction.reply({ embeds: [webEmbed], ephemeral: true });
            break;
        case 'pronouns':
            const pronouns = value;
            if (!['she/her', 'he/him', 'they/them'].includes(pronouns)) {
                return interaction.reply({
                    content: client.i18n.t('PROFILE_INVALID_PRONOUNS', {
                        lng: interaction.locale
                    }),
                    ephemeral: true
                });
            }
            if (profile) {
                await r.table('profile').get(interaction.user.id).update({ pronouns }).run(client.conn);
            } else {
                await r
                    .table('profile')
                    .insert({
                        id: interaction.user.id,
                        pronouns
                    })
                    .run(client.conn);
            }
            const pronounEmbed = new Embed(client, interaction.locale)
                .setLocaleTitle('PROFILE_SUCCESS')
                .setLocaleDescription('PROFILE_SET_PRONOUNS', {
                    pronouns
                });
            interaction.reply({ embeds: [pronounEmbed], ephemeral: true });
            break;
        case 'description':
            const description = value;
            if (description.length > 300) {
                return interaction.reply({
                    content: client.i18n.t('PROFILE_DESCRIPTION_LENGTH', {
                        lng: interaction.locale
                    }),
                    ephemeral: true
                });
            }
            if (profile) {
                await r.table('profile').get(interaction.user.id).update({ description }).run(client.conn);
            } else {
                await r
                    .table('profile')
                    .insert({
                        id: interaction.user.id,
                        description
                    })
                    .run(client.conn);
            }
            const descEmbed = new Embed(client, interaction.locale)
                .setLocaleTitle('PROFILE_SUCCESS')
                .setLocaleDescription('PROFILE_SET_DESCRIPTION', {
                    description
                });
            interaction.reply({ embeds: [descEmbed], ephemeral: true });
            break;
        case 'birthday':
            const birthday = value;
            let [day, month]: any = birthday.split('/');
            day = parseInt(day) || 0;
            month = parseInt(month) || 0;
            if (day > 31 || day < 1 || month > 12 || month < 1) {
                interaction.reply({
                    content: client.i18n.t('PROFILE_INVALID_BIRTHDAY', {
                        lng: interaction.locale
                    }),
                    ephemeral: true
                });
                break;
            }
            if (profile) {
                await r.table('profile').get(interaction.user.id).update({ birthday }).run(client.conn);
            } else {
                await r
                    .table('profile')
                    .insert({
                        id: interaction.user.id,
                        birthday
                    })
                    .run(client.conn);
            }
            const embed = new Embed(client, interaction.locale)
                .setLocaleTitle('PROFILE_SUCCESS')
                .setLocaleDescription('PROFILE_SET_BIRTHDAY', { birthday });
            interaction.reply({ embeds: [embed], ephemeral: true });
            break;
    }
}
