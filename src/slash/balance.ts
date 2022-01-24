import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
export async function run(client: FluorineClient, message: Message) {
    const balance = await client.economy.get(
        message.author.id,
        message.guild.id
    );
    const embed = new Embed(client, message.guild.preferredLocale)
        .setLocaleTitle('BALANCE')
        .addLocaleField({
            name: 'BALANCE_WALLET',
            value: `${balance.wallet.toString()}$`
        })
        .addLocaleField({
            name: 'BALANCE_BANK',
            value: `${balance.bank.toString()}$`
        });
    return message.reply({ embeds: [embed] });
}
