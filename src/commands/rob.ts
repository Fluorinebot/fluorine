import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    if (user.id === interaction.user.id) {
        return interaction.reply(client.i18n.t('ROB_SELF', { lng: interaction.locale }));
    }
    if (!interaction.guild.members.cache.get(user.id)) {
        return interaction.reply(client.i18n.t('ROB_INVALID_USER', { lng: interaction.locale }));
    }
    const userBalance = await client.economy.get(user.id, interaction.guildId);
    const robberBalance = await client.economy.get(interaction.user.id, interaction.guildId);

    const cooldown = await client.economy.getCooldown(user.id, interaction.guildId);
    const earnedPercent = Math.round(Math.random() * 20) + 20;
    const earned = Math.round(userBalance.wallet * (earnedPercent / 100));
    const chance = Math.random() * 100;
    const currency = await client.economy.getCurrency(interaction.guildId);
    client.economy.setCooldown(interaction.user.id, interaction.guildId, {
        rob: Date.now() / 1000 + 3600 * 12
    });

    if (userBalance.wallet < 0)
        return interaction.reply(client.i18n.t('ROB_FAIL_NO_MONEY', { lng: interaction.locale }));

    if (chance > 40) {
        const lost = Math.round((robberBalance.bank + robberBalance.wallet) * (earned / 100));
        client.economy.subtract(interaction.user.id, interaction.guildId, lost);
        return interaction.reply(
            client.i18n.t('ROB_FAIL_CAUGHT', {
                lng: interaction.locale,
                amount: `${lost} ${currency}`
            })
        );
    }
    if (cooldown.rob > Date.now() / 1000) {
        return interaction.reply(
            client.i18n.t('ROB_COOLDOWN', {
                lng: interaction.locale,
                time: `<t:${cooldown.rob}:R>`
            })
        );
    }
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('ROB_SUCCESS_TITLE', { user: user.username })
        .setLocaleDescription('ROB_SUCCESS_DESCRIPTION', {
            amount: `${earned} ${currency}`
        });
    client.economy.add(interaction.user.id, interaction.guildId, earned);
    client.economy.subtract(user.id, interaction.guildId, earned);
    return interaction.reply({ embeds: [embed] });
}
export const data = new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Rob a user')
    .addUserOption(option => option.setName('user').setDescription('User you want to rob').setRequired(true));
export const category: Category = 'economy';
