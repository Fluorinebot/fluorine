import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder()
    .setName('shop')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Buy something with your economy money!')
    .setDescriptionLocalizations({ pl: 'replace_me' });

export const category: Category = 'economy';
