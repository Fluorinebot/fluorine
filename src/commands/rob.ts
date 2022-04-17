import FluorineClient from '@classes/Client';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';
import Embed from '@classes/Embed';
export async function run(client: FluorineClient, interaction: CommandInteraction) {
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
    const earned = Math.round(userBalance.wallet_bal * (earnedPercent / 100));
    const chance = Math.random() * 100;
    const currency = await client.economy.getCurrency(interaction.guildId);

    if (userBalance.wallet_bal < 0) {
        return interaction.reply(client.i18n.t('ROB_FAIL_NO_MONEY', { lng: interaction.locale }));
    }

    if (chance > 40) {
        const lost = Math.round((robberBalance.bank_bal + robberBalance.wallet_bal) * (earned / 100));
        client.economy.subtract(interaction.guildId, interaction.user, lost);

        return interaction.reply(
            client.i18n.t('ROB_FAIL_CAUGHT', {
                lng: interaction.locale,
                amount: `${lost} ${currency}`
            })
        );
    }

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('ROB_SUCCESS_TITLE', { user: user.username })
        .setLocaleDescription('ROB_SUCCESS_DESCRIPTION', {
            amount: `${earned} ${currency}`
        });

    client.economy.add(interaction.guildId, interaction.user, earned);
    client.economy.subtract(interaction.guildId, interaction.user, earned);

    return interaction.reply({ embeds: [embed] });
}
export const data = new SlashCommandBuilder()
    .setName('rob')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Rob a user')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addUserOption(option =>
        option
            .setName('user')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('User you want to rob')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    );

export const category: Category = 'economy';
export const cooldown = 12 * 60 * 60 * 1000;
