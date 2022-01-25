import FluorineClient from '@classes/Client';
import canvas from 'canvas';
import { Message, MessageAttachment } from 'discord.js';
import r from 'rethinkdb';
import fragmentText from '@util/fragmentText';
import Embed from '@classes/Embed';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (args[0] === 'set') {
        const profile = await r
            .table('profile')
            .get(message.author.id)
            .run(client.conn);
        switch (args[1]) {
            case 'description':
                if (!args[2]) {
                    break;
                }
                const description = args.slice(2).join(' ');
                if (description.length > 300) {
                    return message.reply(
                        client.language.get(
                            message.guild.preferredLocale,
                            'PROFILE_DESCRIPTION_LENGTH'
                        )
                    );
                }

                if (profile) {
                    await r
                        .table('profile')
                        .get(message.author.id)
                        .update({ description })
                        .run(client.conn);
                } else {
                    await r
                        .table('profile')
                        .insert({
                            id: message.author.id,
                            description
                        })
                        .run(client.conn);
                }
                const descEmbed = new Embed(
                    client,
                    message.guild.preferredLocale
                )
                    .setLocaleTitle('PROFILE_SUCCESS')
                    .setLocaleDescription('PROFILE_SET_DESCRIPTION', {
                        description
                    });
                message.reply({ embeds: [descEmbed] });
                break;

            case 'website':
                if (!args[2]) {
                    break;
                }
                const website = args.slice(2).join(' ');
                const regex =
                    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,20}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gu;
                if (!website.match(regex)) {
                    return message.reply(
                        client.language.get(
                            message.guild.preferredLocale,
                            'PROFILE_INVALID_WEBSITE'
                        )
                    );
                }
                if (profile) {
                    await r
                        .table('profile')
                        .get(message.author.id)
                        .update({ website })
                        .run(client.conn);
                } else {
                    await r
                        .table('profile')
                        .insert({
                            id: message.author.id,
                            website
                        })
                        .run(client.conn);
                }
                const webEmbed = new Embed(
                    client,
                    message.guild.preferredLocale
                )
                    .setLocaleTitle('PROFILE_SUCCESS')
                    .setLocaleDescription('PROFILE_SET_WEBSITE', { website });
                message.reply({ embeds: [webEmbed] });
                break;

            case 'birthday':
                if (!args[2]) {
                    break;
                }
                // eslint-disable-next-line prefer-destructuring
                const birthday = args[2];
                let [day, month]: any = birthday.split('/');
                day = parseInt(day) || 0;
                month = parseInt(month) || 0;
                if (day > 31 || day < 1 || month > 12 || month < 1) {
                    message.reply(
                        client.language.get(
                            message.guild.preferredLocale,
                            'PROFILE_INVALID_BIRTHDAY'
                        )
                    );
                    break;
                }
                if (profile) {
                    await r
                        .table('profile')
                        .get(message.author.id)
                        .update({ birthday })
                        .run(client.conn);
                } else {
                    await r
                        .table('profile')
                        .insert({
                            id: message.author.id,
                            birthday
                        })
                        .run(client.conn);
                }
                const embed = new Embed(client, message.guild.preferredLocale)
                    .setLocaleTitle('PROFILE_SUCCESS')
                    .setLocaleDescription('PROFILE_SET_BIRTHDAY', { birthday });
                message.reply({ embeds: [embed] });
                break;
            case 'location':
                const location = args.slice(2).join(' ');
                if (!location || location.length > 15 || location.length < 3) {
                    return message.reply(
                        client.language.get(
                            message.guild.preferredLocale,
                            'PROFILE_INVALID_LOCATION'
                        )
                    );
                }
                if (profile) {
                    await r
                        .table('profile')
                        .get(message.author.id)
                        .update({ location })
                        .run(client.conn);
                } else {
                    await r
                        .table('profile')
                        .insert({
                            id: message.author.id,
                            location
                        })
                        .run(client.conn);
                }
                const locEmbed = new Embed(
                    client,
                    message.guild.preferredLocale
                )
                    .setLocaleTitle('PROFILE_SUCCESS')
                    .setLocaleDescription('PROFILE_SET_LOCATION', {
                        location
                    });
                message.reply({ embeds: [locEmbed] });
                break;
            case 'pronouns':
                // eslint-disable-next-line prefer-destructuring
                const pronouns = args[2];
                if (
                    !pronouns ||
                    !['she/her', 'he/him', 'they/them'].includes(pronouns)
                ) {
                    return message.reply(
                        client.language.get(
                            message.guild.preferredLocale,
                            'PROFILE_INVALID_PRONOUNS'
                        )
                    );
                }
                if (profile) {
                    await r
                        .table('profile')
                        .get(message.author.id)
                        .update({ pronouns })
                        .run(client.conn);
                } else {
                    await r
                        .table('profile')
                        .insert({
                            id: message.author.id,
                            pronouns
                        })
                        .run(client.conn);
                }
                const pronounEmbed = new Embed(
                    client,
                    message.guild.preferredLocale
                )
                    .setLocaleTitle('PROFILE_SUCCESS')
                    .setLocaleDescription('PROFILE_SET_PRONOUNS', {
                        pronouns
                    });
                message.reply({ embeds: [pronounEmbed] });
                break;
            default:
                message.reply(
                    client.language.get(
                        message.guild.preferredLocale,
                        'PROFILE_INVALID_OPTION'
                    )
                );
                break;
        }
    } else {
        const user =
            client.users.cache.get(args[0]) ||
            message.mentions.members.first()?.user ||
            message.author;
        const notSet = client.language.get(
            message.guild.preferredLocale,
            'PROFILE_NOT_SET'
        );
        const profile: any =
            (await r.table('profile').get(user.id).run(client.conn)) || {};
        if (profile?.birthday) {
            const birthday = profile.birthday.split('/');
            profile.birthday = `${
                client.language.get(message.guild.preferredLocale, 'MONTHS')[
                    parseInt(birthday[1]) - 1
                ]
            } ${birthday[0]}`;
        } else {
            profile.birthday = notSet;
        }
        canvas.registerFont(`${__dirname}/../../assets/Inter-Light.ttf`, {
            family: 'Inter',
            weight: 'light'
        });
        canvas.registerFont(`${__dirname}/../../assets/Poppins-Regular.ttf`, {
            family: 'Poppins',
            weight: 'normal'
        });
        canvas.registerFont(`${__dirname}/../../assets/Poppins-Medium.ttf`, {
            family: 'Poppins',
            weight: 'bold'
        });
        const image = await canvas.loadImage(
            `${__dirname}/../../assets/template.png`
        );
        const avatar = await canvas.loadImage(
            user.displayAvatarURL({ format: 'png' })
        );
        const canva = canvas.createCanvas(image.width, image.height);
        const ctx = canva.getContext('2d');
        ctx.drawImage(image, 0, 0);
        ctx.font = 'bold 55px "Poppins"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(user.tag, 170, 83);
        ctx.font = 'bold 47px "Poppins"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(
            client.language.get(
                message.guild.preferredLocale,
                'PROFILE_DESCRIPTION'
            ),
            30,
            190
        );
        // other info
        ctx.font = 'bold 42px "Poppins"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(
            client.language.get(
                message.guild.preferredLocale,
                'PROFILE_WEBSITE'
            ),
            986,
            205
        );
        ctx.fillText(
            client.language.get(
                message.guild.preferredLocale,
                'PROFILE_BIRTHDAY'
            ),
            986,
            435
        );
        ctx.fillText(
            client.language.get(
                message.guild.preferredLocale,
                'PROFILE_LOCATION'
            ),
            986,
            655
        );
        ctx.font = 'light 40px "Inter"';
        ctx.fillText(profile?.website || notSet, 986, 265);
        ctx.fillText(profile?.birthday || notSet, 986, 490);
        ctx.fillText(profile?.location || notSet, 986, 710);
        ctx.fillText(
            fragmentText(
                ctx,
                profile?.description ||
                    client.language.get(
                        message.guild.preferredLocale,
                        'PROFILE_NOT_SET_DESCRIPTION'
                    ),
                900
            ).join('\n'),
            30,
            245
        );
        ctx.font = 'bold 50px "Poppins"';
        ctx.fillText(profile?.pronouns || notSet, 1150, 83);
        ctx.arc(85, 62, 55, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(avatar, 30, 7, 110, 110);
        const attachment = new MessageAttachment(
            canva.toBuffer(),
            'profile.png'
        );
        message.reply({ files: [attachment] });
    }
}
export const help = {
    name: 'profile',
    description: 'Profil użytkownika',
    aliases: [],
    category: 'fun'
};
