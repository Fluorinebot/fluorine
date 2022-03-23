import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export const data = new SlashCommandBuilder().setName('shop').setDescription('Buy something with your economy money!');

export const category: Category = 'economy';
