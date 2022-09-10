import { Embed, type FluorineClient } from '#classes';
import { type ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const table = client.prisma.profile;

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

            await table.upsert({
                where: { userId: BigInt(interaction.user.id) },
                update: { birthday },
                create: {
                    userId: BigInt(interaction.user.id),
                    birthday
                }
            });

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

            await table.upsert({
                where: { userId: BigInt(interaction.user.id) },
                update: { location: value },
                create: {
                    userId: BigInt(interaction.user.id),
                    location: value
                }
            });

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

            await table.upsert({
                where: { userId: BigInt(interaction.user.id) },
                update: { website },
                create: {
                    userId: BigInt(interaction.user.id),
                    website
                }
            });

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

            await table.upsert({
                where: { userId: BigInt(interaction.user.id) },
                update: { pronouns },
                create: {
                    userId: BigInt(interaction.user.id),
                    pronouns
                }
            });

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

            await table.upsert({
                where: { userId: BigInt(interaction.user.id) },
                update: { description },
                create: {
                    userId: BigInt(interaction.user.id),
                    description
                }
            });

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
    .setNameLocalizations({ pl: 'ustaw' })
    .setDescription('Set a profile')
    .setDescriptionLocalizations({ pl: 'Ustaw profil' })
    .addStringOption(option =>
        option
            .setName('field')
            .setNameLocalizations({ pl: 'rubryka' })
            .setDescription('Field to set')
            .setDescriptionLocalizations({ pl: 'Rubryka, którą chcesz zmienić' })
            .setRequired(true)
            .setChoices(
                {
                    name: 'Birthday',
                    name_localizations: {
                        pl: 'Urodziny'
                    },
                    value: 'birthday'
                },
                {
                    name: 'Description',
                    name_localizations: {
                        pl: 'Opis'
                    },
                    value: 'description'
                },
                {
                    name: 'Location',
                    name_localizations: {
                        pl: 'Lokalizacja'
                    },
                    value: 'location'
                },
                {
                    name: 'Pronouns',
                    name_localizations: {
                        pl: 'Zaimki'
                    },
                    value: 'pronouns'
                },
                {
                    name: 'Website',
                    name_localizations: {
                        pl: 'Strona internetowa'
                    },
                    value: 'website'
                }
            )
    )
    .addStringOption(option =>
        option
            .setName('value')
            .setNameLocalizations({ pl: 'wartość' })
            .setDescription('Value to set')
            .setDescriptionLocalizations({ pl: 'Wartość, którą ustawić' })
            .setRequired(true)
    );
