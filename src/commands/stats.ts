import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export async function run(client: FluorineClient, interaction: CommandInteraction) {
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('STATS_TITLE')
        .addLocaleField({
            name: 'STATS_MEMORY_USAGE',
            value: `${(process.memoryUsage.rss() / 1_000_000).toFixed(1)} MB`
        })
        .addLocaleField({
            name: 'STATS_USER_COUNT',
            value: client.users.cache.size.toString()
        })
        .addLocaleField({
            name: 'STATS_SERVER_COUNT',
            value: client.guilds.cache.size.toString()
        })
        .addLocaleField({
            name: 'STATS_UPTIME',
            value: `<t:${Math.floor((Date.now() - client.uptime) / 1000)}:R>`
        });
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder().setName('stats').setDescription('Statistics of the bot');

export const category: Category = 'tools';
