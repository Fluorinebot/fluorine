import FluorineClient from '@classes/Client';
import canvas from 'canvas';
import { Message, MessageAttachment } from 'discord.js';
import r from 'rethinkdb';
import fragmentText from '@util/fragmentText';
export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (args[0] === 'set') {
        switch (args[1]) {
            case 'description':
                if (!args[2]) {
                    break;
                }
                const user = r.table('profile').get(message.author.id);
                const description = args.slice(2).join(' ');
                if (description.length > 300) {
                    return message.reply(
                        client.language.get(
                            message.guild.preferredLocale,
                            'PROFILE_DESCRIPTION_LENGTH'
                        )
                    );
                }

                if (user) {
                    await user.update({ description }).run(client.conn);
                } else {
                    await r
                        .table('profile')
                        .insert({
                            id: message.author.id,
                            description
                        })
                        .run(client.conn);
                }

                message.reply(
                    client.language.get(
                        message.guild.preferredLocale,
                        'PROFILE_SET_DESCRIPTION',
                        { description }
                    )
                );
                break;
        }
    }
    const user = {
        description:
            'very long description i like dogs and ts and i hate python !!!!!!!!!!!!!!!!!',
        website: 'xiboon.me',
        birthday: 'November 24th',
        location: 'poland',
        pronouns: 'he/him'
    };
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
        message.author.displayAvatarURL({ format: 'png' })
    );
    const canva = canvas.createCanvas(image.width, image.height);
    const ctx = canva.getContext('2d');
    ctx.drawImage(image, 0, 0);
    ctx.font = 'bold 55px "Poppins"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(message.author.tag, 170, 83);
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
        client.language.get(message.guild.preferredLocale, 'PROFILE_WEBSITE'),
        986,
        205
    );
    ctx.fillText(
        client.language.get(message.guild.preferredLocale, 'PROFILE_BIRTHDAY'),
        986,
        435
    );
    ctx.fillText(
        client.language.get(message.guild.preferredLocale, 'PROFILE_LOCATION'),
        986,
        655
    );
    ctx.font = 'light 40px "Inter"';
    ctx.fillText(user.website, 986, 265);
    ctx.fillText(user.birthday, 986, 490);
    ctx.fillText(user.location, 986, 710);
    ctx.fillText(fragmentText(ctx, user.description, 900).join('\n'), 30, 245);
    ctx.font = 'bold 50px "Poppins"';
    ctx.fillText(user.pronouns, 1150, 83);
    ctx.arc(85, 62, 55, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.drawImage(avatar, 30, 7, 110, 110);
    const attachment = new MessageAttachment(canva.toBuffer(), 'profile.png');
    message.reply({ files: [attachment] });
}
export const help = {
    name: 'profile',
    description: 'Profil użytkownika',
    aliases: [],
    category: 'fun'
};
