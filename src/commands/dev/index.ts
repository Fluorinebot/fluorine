import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder()
    .setName('dev')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription("Commands intended to ease in Fluorine's development.")
    .setDescriptionLocalizations({ pl: 'replace_me' });

export const category: Category = 'tools';
export const dev = true;
