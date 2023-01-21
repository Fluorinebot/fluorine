import { EmbedBuilder, SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const list = await client.shop.list(interaction.guildId);
    const embed = new EmbedBuilder(client, interaction.locale).setTitle('SHOP_LIST_TITLE');

    const currency = await client.economy.getCurrency(interaction.guildId);

    if (list.length) {
        list.forEach(item => {
            embed.addFields({ rawName: `${item.name} - ${item.price} ${currency}`, rawValue: item.description });
        });
    } else {
        embed.setDescription('NONE');
    }

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandSubcommandBuilder('LIST');
