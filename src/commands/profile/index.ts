import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export const data = new SlashCommandBuilder().setName('profile').setDescription('View/set a profile');

export const category: Category = 'tools';
