import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';
import FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const list = await client.shop.list(interaction.guildId);
    const embed = new Embed(client, interaction.locale).setLocaleTitle('SHOP_LIST_TITLE');

    const currency = await client.economy.getCurrency(interaction.guildId);

    if (list.length) {
        list.forEach(item => {
            embed.addFields({ name: `${item.name} - ${item.price} ${currency}`, value: item.description });
        });
    } else {
        embed.setLocaleDescription('NONE');
    }

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('list')
    .setNameLocalizations({ pl: 'lista' })
    .setDescription('List all items in the shop')
    .setDescriptionLocalizations({ pl: 'Lista wszystkich przedmiotów w sklepie' });
