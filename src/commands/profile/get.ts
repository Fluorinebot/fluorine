import FluorineClient from '@classes/Client';
import { CommandInteraction, MessageAttachment } from 'discord.js';
import r from 'rethinkdb';
import canvas from 'canvas';
import fragmentText from '@util/fragmentText';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const userOption = interaction.options.getUser('user');
    const user = userOption || interaction.user;
    const notSet = client.language.get(interaction.locale, 'PROFILE_NOT_SET');
    const profile: any =
        (await r.table('profile').get(user.id).run(client.conn)) || {};
    if (profile?.birthday) {
        const birthday = profile.birthday.split('/');
        profile.birthday = `${
            client.language.get(interaction.locale, 'MONTHS')[
                parseInt(birthday[1]) - 1
            ]
        } ${birthday[0]}`;
    } else {
        profile.birthday = notSet;
    }
    canvas.registerFont(`${__dirname}/../../../assets/Inter-Light.ttf`, {
        family: 'Inter',
        weight: 'light'
    });
    canvas.registerFont(`${__dirname}/../../../assets/Poppins-Regular.ttf`, {
        family: 'Poppins',
        weight: 'normal'
    });
    canvas.registerFont(`${__dirname}/../../../assets/Poppins-Medium.ttf`, {
        family: 'Poppins',
        weight: 'bold'
    });
    const image = await canvas.loadImage(
        `${__dirname}/../../../assets/template.png`
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
        client.language.get(interaction.locale, 'PROFILE_DESCRIPTION'),
        30,
        190
    );
    // other info
    ctx.font = 'bold 42px "Poppins"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(
        client.language.get(interaction.locale, 'PROFILE_WEBSITE'),
        986,
        205
    );
    ctx.fillText(
        client.language.get(interaction.locale, 'PROFILE_BIRTHDAY'),
        986,
        435
    );
    ctx.fillText(
        client.language.get(interaction.locale, 'PROFILE_LOCATION'),
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
                    interaction.locale,
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
    const attachment = new MessageAttachment(canva.toBuffer(), 'profile.png');
    interaction.reply({ files: [attachment] });
}
