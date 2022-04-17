import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Profile } from 'types/databaseTables';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const profile =
        (
            await client.db.query<Profile>('SELECT user_id FROM profiles WHERE user_id = $1;', [
                BigInt(interaction.user.id)
            ])
        ).rows.length === 1;

    const field = interaction.options.getString('field');
    const value = interaction.options.getString('value');

    switch (field) {
        case 'birthday': {
            const birthday = value;
            const [day, month] = birthday.split('/').map(str => parseInt(str) || 0);

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
                await client.db.query('UPDATE profiles SET birthday = $1 WHERE user_id = $2', [
                    value,
                    BigInt(interaction.user.id)
                ]);
            } else {
                await client.db.query(
                    'INSERT INTO profiles(user_id, description, pronouns, website, location, birthday) VALUES($1, null, null, null, null, $2)',
                    [BigInt(interaction.user.id), value]
                );
            }

            const embed = new Embed(client, interaction.locale)
                .setLocaleTitle('PROFILE_SUCCESS')
                .setLocaleDescription('PROFILE_SET_BIRTHDAY', { birthday });

            interaction.reply({ embeds: [embed], ephemeral: true });
            break;
        }

        case 'location': {
            if (value.length > 15 || value.length < 3) {
                return interaction.reply({
                    content: client.i18n.t('PROFILE_INVALID_LOCATION', {
                        lng: interaction.locale
                    }),
                    ephemeral: true
                });
            }

            if (profile) {
                await client.db.query('UPDATE profiles SET location = $1 WHERE user_id = $2', [
                    value,
                    BigInt(interaction.user.id)
                ]);
            } else {
                await client.db.query(
                    'INSERT INTO profiles(user_id, description, pronouns, website, location, birthday) VALUES($1, null, null, null, $2, null)',
                    [BigInt(interaction.user.id), value]
                );
            }

            const embed = new Embed(client, interaction.locale)
                .setLocaleTitle('PROFILE_SUCCESS')
                .setLocaleDescription('PROFILE_SET_LOCATION', {
                    location: value
                });

            interaction.reply({ embeds: [embed], ephemeral: true });
            break;
        }

        case 'website': {
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
                await client.db.query('UPDATE profiles SET website = $1 WHERE user_id = $2', [
                    value,
                    BigInt(interaction.user.id)
                ]);
            } else {
                await client.db.query(
                    'INSERT INTO profiles(user_id, description, pronouns, website, location, birthday) VALUES($1, null, null, $2, null, null)',
                    [BigInt(interaction.user.id), value]
                );
            }

            const embed = new Embed(client, interaction.locale)
                .setLocaleTitle('PROFILE_SUCCESS')
                .setLocaleDescription('PROFILE_SET_WEBSITE', { website });

            interaction.reply({ embeds: [embed], ephemeral: true });
            break;
        }

        case 'pronouns': {
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
                await client.db.query('UPDATE profiles SET pronouns = $1 WHERE user_id = $2', [
                    value,
                    BigInt(interaction.user.id)
                ]);
            } else {
                await client.db.query(
                    'INSERT INTO profiles(user_id, description, pronouns, website, location, birthday) VALUES($1, null, $2, null, null, null)',
                    [BigInt(interaction.user.id), value]
                );
            }

            const embed = new Embed(client, interaction.locale)
                .setLocaleTitle('PROFILE_SUCCESS')
                .setLocaleDescription('PROFILE_SET_PRONOUNS', {
                    pronouns
                });

            interaction.reply({ embeds: [embed], ephemeral: true });
            break;
        }

        case 'description': {
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
                await client.db.query('UPDATE profiles SET description = $1 WHERE user_id = $2', [
                    value,
                    BigInt(interaction.user.id)
                ]);
            } else {
                await client.db.query(
                    'INSERT INTO profiles(user_id, description, pronouns, website, location, birthday) VALUES($1, $2, null, null, null, null)',
                    [BigInt(interaction.user.id), value]
                );
            }

            const embed = new Embed(client, interaction.locale)
                .setLocaleTitle('PROFILE_SUCCESS')
                .setLocaleDescription('PROFILE_SET_DESCRIPTION', {
                    description
                });

            interaction.reply({ embeds: [embed], ephemeral: true });
            break;
        }
    }
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('set')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Set a profile')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addStringOption(option =>
        option
            .setName('field')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Field to set')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
            .setChoices(
                {
                    name: 'Birthday',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'birthday'
                },
                {
                    name: 'Description',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'description'
                },
                {
                    name: 'Location',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'location'
                },
                {
                    name: 'Pronouns',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'pronouns'
                },
                {
                    name: 'Website',
                    name_localizations: {
                        pl: 'replace_me'
                    },
                    value: 'website'
                }
            )
    )
    .addStringOption(option =>
        option
            .setName('value')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('Value to set')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    );
