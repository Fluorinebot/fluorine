import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Category } from 'types/structures';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const random = Math.floor(Math.random() * 3);
    const money = Math.floor(Math.random() * 150 + 50);

    const description = client.i18n.t(`WORK_SUCCESS_DESCRIPTION.${random}`, {
        lng: interaction.locale,
        amount: `${money} ${await client.economy.getCurrency(interaction.guildId)}`
    });

    const embed = new Embed(client, interaction.locale).setLocaleTitle('WORK_SUCCESS').setDescription(description);

    client.economy.add(interaction.guildId, interaction.user, money);

    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('work')
    .setNameLocalizations({ pl: 'pracuj' })
    .setDescription('Get money from working!')
    .setDescriptionLocalizations({ pl: 'Zdobądź pieniądze za pracę!' })
    .setDMPermission(false);

export const category: Category = 'economy';
export const cooldown = 30 * 60 * 1000;
