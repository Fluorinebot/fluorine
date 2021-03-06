import FluorineClient from '#classes/Client';
import { Category } from '#types/structures';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Embed from '#classes/Embed';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const currency = await client.economy.getCurrency(interaction.guildId);
    const random = Math.floor(Math.random() * 10);

    if (random > 7) {
        const money = Math.floor(Math.random() * 200) + 50;

        interaction.reply({
            content: client.i18n.t('CRIME_FAIL_DESCRIPTION', {
                lng: interaction.locale,
                amount: `${money} ${currency}`
            }),
            ephemeral: true
        });

        return client.economy.subtract(interaction.guildId, interaction.user, money);
    }

    const money = Math.floor(Math.random() * 200) + 100;

    const description = client.i18n.t(`CRIME_SUCCESS_DESCRIPTION.${Math.floor(Math.random() * 3)}`, {
        lng: interaction.locale,
        amount: `${money} ${currency}`
    });

    const embed = new Embed(client, interaction.locale).setLocaleTitle('CRIME_SUCCESS').setDescription(description);

    interaction.reply({ embeds: [embed] });
    client.economy.add(interaction.guildId, interaction.user, money);
}

export const data = new SlashCommandBuilder()
    .setName('crime')
    .setNameLocalizations({ pl: 'przestępstwo' })
    .setDescription('Commit a crime')
    .setDescriptionLocalizations({ pl: 'Popełnij przestępstwo w ekonomii' })
    .setDMPermission(false);

export const category: Category = 'economy';
export const cooldown = 1 * 60 * 60 * 1000;
