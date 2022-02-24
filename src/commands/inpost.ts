import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { fetch } from 'undici';
export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const id = interaction.options.getString('id');
    const statusURL = client.i18n.t('INPOST_URL', { lng: interaction.locale });
    const statuses: any = await fetch(statusURL).then(res => res.json());
    const req: any = await fetch(`https://api-shipx-pl.easypack24.net/v1/tracking/${id}`);
    const response = await req.json();
    if (req.status !== 200) {
        return interaction.reply({
            content: client.i18n.t('INPOST_NOT_FOUND', {
                lng: interaction.locale,
                id
            }),
            ephemeral: true
        });
    }
    const embed = new Embed(client, interaction.locale).setLocaleTitle('INPOST_TITLE', { id }).setColor('#ffcb39');

    if (response.custom_attributes.target_machine_detail.name) {
        embed.setLocaleDescription('INPOST_DESCRIPTION', response.custom_attributes.target_machine_detail);
    }
    response.tracking_details.reverse().forEach(data => {
        const statusObj = statuses.items.find(element => element.name === data.status);
        embed.addField(statusObj.title, statusObj.description);
    });
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('inpost')
    .setDescription('Track an InPost package')
    .addStringOption(option => option.setName('id').setDescription('ID of the package').setRequired(true));

export const category = 'tools';
