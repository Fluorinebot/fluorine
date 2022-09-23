import { Embed, type FluorineClient } from '#classes';
import type { InpostStatuses, InpostTrackObj } from '#types';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import type { fetch as _fetch } from 'undici';
declare const fetch: typeof _fetch;

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getString('id');

    const statusURL = client.i18n.t('INPOST_URL', { lng: interaction.locale });
    const statuses = (await fetch(statusURL).then(res => res.json())) as InpostStatuses;

    const req = await fetch(`https://api-shipx-pl.easypack24.net/v1/tracking/${id}`);
    const response = await req.json() as InpostTrackObj;

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
        const status = statuses.items.find(element => element.name === data.status);
        embed.addFields({ name: status.title, value: status.description });
    });

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('inpost')
    .setNameLocalizations({ pl: 'inpost' })
    .setDescription('Track an InPost package')
    .setDescriptionLocalizations({ pl: 'Śledź paczkę w InPost' })
    .addStringOption(option =>
        option
            .setName('id')
            .setNameLocalizations({ pl: 'id' })
            .setDescription('ID of the package')
            .setDescriptionLocalizations({ pl: 'Id paczki' })
            .setRequired(true)
    );

export const category = 'tools';
