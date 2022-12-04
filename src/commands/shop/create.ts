import { Embed, type FluorineClient } from '#classes';
import type { ShopItemConstructor } from '#types';
import { type ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const price = interaction.options.getInteger('price');
    const role = interaction.options.getRole('role');

    const obj: ShopItemConstructor = { name, description, price, guildId: BigInt(interaction.guildId) };

    if (role) {
        obj.role = BigInt(role.id);
    }

    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.reply({
            content: client.i18n.t('SHOP_CREATE_PERMISSIONS', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    const existingItem = await client.shop.get(interaction.guildId, name);

    if (existingItem) {
        return interaction.reply({ content: client.i18n.t('SHOP_CREATE_EXISTS') });
    }
    const embed = new Embed(client, interaction.locale).setLocaleTitle('SHOP_CREATE_SUCCESS').addLocaleFields([
        { name: 'SHOP_CREATE_NAME', value: name },
        { name: 'SHOP_CREATE_DESCRIPTION', value: description },
        {
            name: 'SHOP_CREATE_PRICE',
            value: `${price} ${await client.economy.getCurrency(interaction.guildId)}`
        }
    ]);

    interaction.reply({ embeds: [embed] });
    client.shop.add(obj);
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setNameLocalizations({ pl: 'utwórz' })
    .setDescription('Create a item!')
    .setDescriptionLocalizations({ pl: 'Utwórz przedmiot!' })
    .addStringOption((option) =>
        option
            .setName('name')
            .setNameLocalizations({ pl: 'nazwa' })
            .setDescription('Name of the item')
            .setDescriptionLocalizations({ pl: 'Nazwa przedmiotu' })
            .setMaxLength(20)
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('description')
            .setNameLocalizations({ pl: 'opis' })
            .setDescription('Description of the item')
            .setDescriptionLocalizations({ pl: 'Opis przedmiotu' })
            .setMaxLength(50)
            .setRequired(true)
    )
    .addIntegerOption((option) =>
        option
            .setName('price')
            .setNameLocalizations({ pl: 'cena' })
            .setDescription('Price of the item')
            .setDescriptionLocalizations({ pl: 'Cena przedmiotu' })
            .setMinValue(1)
            .setRequired(true)
    )
    .addRoleOption((option) =>
        option
            .setName('role')
            .setNameLocalizations({ pl: 'rola' })
            .setDescription('The role you want to give')
            .setDescriptionLocalizations({ pl: 'Rola, którą chcesz nadać' })
            .setRequired(false)
    );
