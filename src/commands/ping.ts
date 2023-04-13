import { EmbedBuilder, SlashCommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Category } from '#types';
import { type ChatInputCommandInteraction } from 'discord.js';

export async function onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder(client, interaction.locale)
        .setTitle('Ping')
        .addFields([{ name: 'PING', value: `${client.ws.ping}ms` }]);

    interaction.reply({ embeds: [embed] });
}

export const slashCommandData = new SlashCommandBuilder('PING');
export const category: Category = 'tools';
