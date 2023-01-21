import { EmbedBuilder, SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { ShopItemConstructor } from '#types';
import { type ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
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
    const embed = new EmbedBuilder(client, interaction.locale).setTitle('SHOP_CREATE_SUCCESS').addFields([
        { name: 'SHOP_CREATE_NAME', rawValue: name },
        { name: 'SHOP_CREATE_DESCRIPTION', rawValue: description },
        { name: 'SHOP_CREATE_PRICE', rawValue: `${price} ${await client.economy.getCurrency(interaction.guildId)}` }
    ]);

    interaction.reply({ embeds: [embed] });
    client.shop.add(obj);
}

export const slashCommandData = new SlashCommandSubcommandBuilder('CREATE')
    .addStringOption('NAME', option => option.setMaxLength(20).setRequired(true))
    .addStringOption('DESCRIPTION', option => option.setMaxLength(50).setRequired(true))
    .addIntegerOption('PRICE', option => option.setMinValue(1).setRequired(true))
    .addRoleOption('ROLE');
