import { Category } from '#types/structures';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('shop')
    .setNameLocalizations({ pl: 'sklep' })
    .setDescription('Buy something with your economy money!')
    .setDescriptionLocalizations({ pl: 'Kup coś za pieniądze w ekonomii!' })
    .setDMPermission(false);

export const category: Category = 'economy';
