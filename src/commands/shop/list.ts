import { CommandInteraction } from 'discord.js';
import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const list = await client.shop.list(interaction.guildId);
    const embed = new Embed(client, interaction.locale).setLocaleTitle(
        'SHOP_LIST_TITLE'
    );
    const currency = await client.economy.getCurrency(interaction.guildId);
    if (list.length) {
        list.forEach(item => {
            embed.addField(
                `${item.name} - ${item.price} ${currency}`,
                item.description
            );
        });
    } else {
        embed.setLocaleDescription('NONE');
    }
    interaction.reply({ embeds: [embed] });
}
