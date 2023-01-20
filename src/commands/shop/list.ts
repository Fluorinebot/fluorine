import { SlashCommandSubcommandBuilder } from '#builders';
import { Embed, type FluorineClient } from '#classes';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
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

export const slashCommandData = new SlashCommandSubcommandBuilder('LIST');
