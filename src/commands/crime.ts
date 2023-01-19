import { SlashCommandBuilder } from '#builders';
import { Embed, type FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const currency = await client.economy.getCurrency(interaction.guildId);
    const random = Math.floor(Math.random() * 10);

    if (random > 7) {
        const money = Math.floor(Math.random() * 200) + 50;

        interaction.reply({
            content: client.i18n.t('CRIME_FAIL_DESCRIPTION', {
                lng: interaction.locale,
                amount: `${money} ${currency}`
            }),
            ephemeral: true
        });

        return client.economy.subtract(interaction.guildId, interaction.user, money);
    }

    const money = Math.floor(Math.random() * 200) + 100;

    const description = client.i18n.t(`CRIME_SUCCESS_DESCRIPTION.${Math.floor(Math.random() * 3)}`, {
        lng: interaction.locale,
        amount: `${money} ${currency}`
    });

    const embed = new Embed(client, interaction.locale).setLocaleTitle('CRIME_SUCCESS').setDescription(description);

    interaction.reply({ embeds: [embed] });
    client.economy.add(interaction.guildId, interaction.user, money);
}

export const slashCommandData = new SlashCommandBuilder('CRIME').setDMPermission(false);

export const category: Category = 'economy';
export const cooldown = 1 * 60 * 60 * 1000;
