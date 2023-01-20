import { SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user');

    if (user.id === interaction.user.id) {
        return interaction.reply(client.i18n.t('ROB_SELF', { lng: interaction.locale }));
    }

    if (!interaction.guild.members.cache.get(user.id)) {
        return interaction.reply(client.i18n.t('ROB_INVALID_USER', { lng: interaction.locale }));
    }

    const userBalance = await client.economy.get(interaction.guildId, user);
    const robberBalance = await client.economy.get(interaction.guildId, interaction.user);

    const earnedPercent = Math.round(Math.random() * 20) + 20;
    const earned = Math.round(userBalance.walletBal * (earnedPercent / 100));
    const chance = Math.random() * 100;
    const currency = await client.economy.getCurrency(interaction.guildId);

    if (userBalance.walletBal < 0) {
        return interaction.reply(client.i18n.t('ROB_FAIL_NO_MONEY', { lng: interaction.locale }));
    }

    if (chance > 40) {
        const lost = Math.round((robberBalance.bankBal + robberBalance.walletBal) * (earned / 100));
        client.economy.subtract(interaction.guildId, interaction.user, lost);

        return interaction.reply(
            client.i18n.t('ROB_FAIL_CAUGHT', {
                lng: interaction.locale,
                amount: `${lost} ${currency}`
            })
        );
    }

    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('ROB_SUCCESS_TITLE', { user: user.username })
        .setDescription('ROB_SUCCESS_DESCRIPTION', {
            amount: `${earned} ${currency}`
        });

    client.economy.add(interaction.guildId, interaction.user, earned);
    client.economy.subtract(interaction.guildId, interaction.user, earned);

    return interaction.reply({ embeds: [embed] });
}
export const slashCommandData = new SlashCommandBuilder('ROB')
    .setDMPermission(false)
    .addUserOption('USER', option => option.setRequired(true));

export const category: Category = 'economy';
export const cooldown = 12 * 60 * 60 * 1000;
