import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Category } from 'types/structures';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const balance = await client.economy.get(interaction.guildId, interaction.user);
    const currency = await client.economy.getCurrency(interaction.guildId);

    const embed = new Embed(client, interaction.locale).setLocaleTitle('BALANCE').addLocaleFields([
        {
            name: 'BALANCE_WALLET',
            value: `${balance.walletBal} ${currency}`
        }
    ]);

    interaction.reply({ embeds: [embed], ephemeral: true });
}

export const data = new SlashCommandBuilder()
    .setName('balance')
    .setNameLocalizations({ pl: 'saldo' })
    .setDescription('Check your balance')
    .setDescriptionLocalizations({ pl: 'Sprawdź swoje saldo' })
    .setDMPermission(false);

export const category: Category = 'economy';
