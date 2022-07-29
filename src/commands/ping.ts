import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Category } from '#types/structures';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const embed = new Embed(client, interaction.locale)
        .setTitle('Ping')
        .addLocaleFields([{ name: 'PING', value: `${client.ws.ping}ms` }]);
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setNameLocalizations({ pl: 'ping' })
    .setDescription("Check the bot's ping")
    .setDescriptionLocalizations({ pl: 'Sprawdź ping bota' });

export const category: Category = 'tools';
