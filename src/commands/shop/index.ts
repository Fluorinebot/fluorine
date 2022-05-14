import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder()
    .setName('shop')
    .setNameLocalizations({ pl: 'sklep' })
    .setDescription('Buy something with your economy money!')
    .setDescriptionLocalizations({ pl: 'Kup coś za pieniądze w ekonomii!' });

export const category: Category = 'economy';
