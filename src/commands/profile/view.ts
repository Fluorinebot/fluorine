import FluorineClient from '#classes/Client';
import { fragmentText } from '#util/fragmentText';
import canvas from 'canvas';
import { AttachmentBuilder, CommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const localeOptions = {
        lng: interaction.locale
    };

    const notSet = client.i18n.t('PROFILE_NOT_SET', localeOptions);
    const profile = await client.prisma.profile.findUnique({ where: { userId: BigInt(user.id) } });

    if (profile?.birthday) {
        const [day, month] = profile.birthday.split('/');
        profile.birthday = `${client.i18n.t(`MONTHS.${parseInt(month) - 1}`, localeOptions)} ${day}`;
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

    const image = await canvas.loadImage(`${__dirname}/../../../assets/template.png`);
    const avatar = await canvas.loadImage(user.displayAvatarURL({ extension: 'png', forceStatic: true }));

    const canva = canvas.createCanvas(image.width, image.height);
    const ctx = canva.getContext('2d');

    ctx.drawImage(image, 0, 0);

    // Tag
    ctx.font = 'bold 55px "Poppins"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(user.tag, 170, 83);

    // Description header
    ctx.font = 'bold 47px "Poppins"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(client.i18n.t('PROFILE_DESCRIPTION', { lng: interaction.locale }), 30, 190);

    // Info Headers
    ctx.font = 'bold 42px "Poppins"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(client.i18n.t('PROFILE_WEBSITE', { lng: interaction.locale }), 986, 205);
    ctx.fillText(client.i18n.t('PROFILE_BIRTHDAY', { lng: interaction.locale }), 986, 435);
    ctx.fillText(client.i18n.t('PROFILE_LOCATION', { lng: interaction.locale }), 986, 655);

    // Info values
    ctx.font = 'light 40px "Inter"';
    ctx.fillText(profile?.website ?? notSet, 986, 265);
    ctx.fillText(profile?.birthday ?? notSet, 986, 490);
    ctx.fillText(profile?.location ?? notSet, 986, 710);

    ctx.fillText(
        fragmentText(
            ctx,
            profile?.description ??
                client.i18n.t('PROFILE_NOT_SET_DESCRIPTION', {
                    lng: interaction.locale
                }),
            900
        ).join('\n'),
        30,
        245
    );

    // Pronouns
    ctx.font = 'bold 50px "Poppins"';
    ctx.fillText(profile?.pronouns ?? '', 1150, 83);

    // User avatar
    ctx.arc(85, 62, 55, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.drawImage(avatar, 30, 7, 110, 110);

    const attachment = new AttachmentBuilder(canva.toBuffer(), { name: 'profile.png' });
    interaction.reply({ files: [attachment] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('view')
    .setNameLocalizations({ pl: 'obejrz' })
    .setDescription('View a profile')
    .setDescriptionLocalizations({ pl: 'Obejrz profil' })
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'u??ytkownik' })
            .setDescription('User to view')
            .setDescriptionLocalizations({ pl: 'U??ytkownik, kt??rego chcesz zobaczy??' })
            .setRequired(false)
    );
