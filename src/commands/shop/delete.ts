import type FluorineClient from '#classes/Client';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'tiscord';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name');
    const itemObj = await client.shop.get(interaction.guildId, name);

    if (!itemObj) {
        return interaction.reply({
            content: client.i18n.t('SHOP_DELETE_NOT_FOUND', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    if (!interaction.member.permissions.has('MANAGE_GUILD')) {
        return interaction.reply({
            content: client.i18n.t('SHOP_DELETE_PERMISSIONS', {
                lng: interaction.locale
            }),
            ephemeral: true
        });
    }

    interaction.reply(client.i18n.t('SHOP_DELETE_SUCCESS', { lng: interaction.locale, item: name }));
    client.shop.delete(interaction.guildId, name);
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setNameLocalizations({ pl: 'usuń' })
    .setDescription('Delete a item from the shop')
    .setDescriptionLocalizations({ pl: 'Usuń przedmiot ze sklepu' })
    .addStringOption(option =>
        option
            .setName('name')
            .setNameLocalizations({ pl: 'nazwa' })
            .setDescription('Name of the item')
            .setDescriptionLocalizations({ pl: 'Nazwa przedmiotu' })
            .setRequired(true)
    );
