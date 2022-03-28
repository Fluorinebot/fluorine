import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder().setName('shop').setDescription('Buy something with your economy money!');

export const category: Category = 'economy';
