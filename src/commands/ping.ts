import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Category } from 'types/structures';

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
