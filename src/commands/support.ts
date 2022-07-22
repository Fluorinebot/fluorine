import FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Category } from '#types/structures';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('SUPPORT_TITLE')
        .setLocaleDescription('SUPPORT_DESCRIPTION', { link: client.support });
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('support')
    .setNameLocalizations({ pl: 'support' })
    .setDescription("Get an invite link to Fluorine's support server")
    .setDescriptionLocalizations({ pl: 'Zdobądź zaproszenie do serwera support Fluorine' });

export const category: Category = 'tools';
