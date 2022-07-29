import type FluorineClient from '#classes/Client';
import Embed from '#classes/Embed';
import type { Category } from '#types/structures';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const money = Math.floor(Math.random() * 200 + 50);
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('SLUT_SUCCESS')
        .setLocaleDescription('SLUT_SUCCESS_DESCRIPTION', {
            amount: `${money} ${await client.economy.getCurrency(interaction.guildId)}`
        });

    client.economy.add(interaction.guildId, interaction.user, money);
    interaction.reply({ embeds: [embed] });
}

export const data = new SlashCommandBuilder()
    .setName('slut')
    .setNameLocalizations({ pl: 'slut' })
    .setDescription('Get money by being a slut!')
    .setDescriptionLocalizations({ pl: 'Zdobądź pieniądze będąc prostytutką!' })
    .setDMPermission(false);

export const category: Category = 'economy';
export const cooldown = 1 * 60 * 60 * 1000;
