import FluorineClient from '@classes/Client';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export async function run(client: FluorineClient, interaction: CommandInteraction<'cached'>) {
    const item = interaction.options.getString('item');
    const itemObj = await client.shop.get(interaction.guildId, item);
    const user = await client.economy.get(interaction.guildId, interaction.user);

    if (!itemObj) {
        return interaction.reply(client.i18n.t('SHOP_BUY_NOT_FOUND', { lng: interaction.locale }));
    }

    if (itemObj.price > user.wallet_bal) {
        return interaction.reply(client.i18n.t('SHOP_BUY_NOT_ENOUGH', { lng: interaction.locale }));
    }

    interaction.reply(
        client.i18n.t('SHOP_BUY_SUCCESS', {
            lng: interaction.locale,
            item: itemObj.name,
            price: `${itemObj.price} ${await client.economy.getCurrency(interaction.guildId)}`
        })
    );

    if (itemObj.role) {
        const role = interaction.guild.roles.cache.get(itemObj.role.toString());

        if (role) {
            await interaction.member.roles?.add(role);
        }
    }

    client.economy.subtract(interaction.guildId, interaction.user, itemObj.price);
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('buy')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Buy an item from the shop')
    .setDescriptionLocalizations({ pl: 'replace_me' })
    .addStringOption(option =>
        option
            .setName('item')
            .setNameLocalizations({ pl: 'replace_me' })
            .setDescription('The item you want to buy')
            .setDescriptionLocalizations({ pl: 'replace_me' })
            .setRequired(true)
    );
