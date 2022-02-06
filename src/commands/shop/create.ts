import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { ShopItem } from 'types/shop';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const [name, description, price, role] = [
        interaction.options.getString('name'),
        interaction.options.getString('description'),
        interaction.options.getNumber('price'),
        interaction.options.getRole('role')
    ];
    const guild = interaction.guildId;
    const obj: ShopItem = { name, description, price, guild };
    if (role) obj.role = role.id;
    if (!interaction.memberPermissions.has('MANAGE_GUILD')) {
        return interaction.reply({
            content: client.i18n.t('SHOP_CREATE_PERMISSIONS', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }
    if (name.length > 19) {
        return interaction.reply(
            client.i18n.t('SHOP_CREATE_NAME_INVALID', {
                lng: interaction.locale
            })
        );
    }
    if (description.length > 49) {
        return interaction.reply(
            client.i18n.t('SHOP_CREATE_DESCRIPTION_INVALID', {
                lng: interaction.locale
            })
        );
    }
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('SHOP_CREATE_SUCCESS')
        .addLocaleField({ name: 'SHOP_CREATE_NAME', value: name })
        .addLocaleField({ name: 'SHOP_CREATE_DESCRIPTION', value: description })
        .addLocaleField({
            name: 'SHOP_CREATE_PRICE',
            value: `${price} ${await client.economy.getCurrency(interaction.guildId)}`
        });
    interaction.reply({ embeds: [embed] });
    client.shop.add(obj);
}
