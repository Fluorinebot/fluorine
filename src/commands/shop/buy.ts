import FluorineClient from '@classes/Client';
import { CommandInteraction } from 'discord.js';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction<'cached'>
) {
    const item = interaction.options.getString('item');
    const itemObj = await client.shop.get(item, interaction.guildId);
    const user = await client.economy.get(
        interaction.user.id,
        interaction.guild.id
    );
    if (!itemObj) {
        return interaction.reply(
            client.language.get(interaction.locale, 'SHOP_BUY_NOT_FOUND')
        );
    }
    if (itemObj.price > user.wallet) {
        return interaction.reply(
            client.language.get(interaction.locale, 'SHOP_BUY_NOT_ENOUGH')
        );
    }
    interaction.reply(
        client.language.get(interaction.locale, 'SHOP_BUY_SUCCESS', {
            item: itemObj.name,
            price:
                itemObj.price +
                (await client.economy.getCurrency(interaction.guildId))
        })
    );
    if (itemObj.role) {
        const role = interaction.guild.roles.cache.get(itemObj.role);
        if (role) {
            await interaction.member.roles?.add(role);
        }
    }
    client.economy.subtract(
        interaction.user.id,
        interaction.guild.id,
        user.wallet - itemObj.price
    );
}
