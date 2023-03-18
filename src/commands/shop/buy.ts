import { SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import { getCommandMention } from '#util';
import { type ChatInputCommandInteraction, type AutocompleteInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction<'cached'>) {
    const item = interaction.options.getString('item');
    const itemObj = await client.shop.get(interaction.guildId, item);
    const user = await client.economy.get(interaction.guildId, interaction.user);

    if (!itemObj) {
        await client.application.commands.fetch();
        return interaction.reply({
            content: client.i18n.t('SHOP_BUY_NOT_FOUND', {
                shopList: await getCommandMention(client, 'shop list'),
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (itemObj.price > user.walletBal) {
        return interaction.reply({
            content: client.i18n.t('SHOP_BUY_NOT_ENOUGH', { lng: interaction.locale }),
            ephemeral: true
        });
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

export async function onAutocomplete(
    client: FluorineClient,
    interaction: AutocompleteInteraction,
    focusedName: string,
    focusedValue: string
) {
    if (focusedName === 'item') {
        const items = await client.prisma.shopItem.findMany({
            where: {
                guildId: BigInt(interaction.guildId),
                name: { contains: focusedValue }
            },
            select: { name: true },
            take: 25,
            orderBy: {
                name: 'asc'
            }
        });

        const predicted = items.map(item => ({ name: item.name, value: item.name }));
        interaction.respond(predicted);
    }
}

export const slashCommandData = new SlashCommandSubcommandBuilder('BUY').addStringOption('ITEM', option =>
    option.setRequired(true).setAutocomplete(true)
);
