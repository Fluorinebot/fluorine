import { SlashCommandBuilder } from '#builders';
import type { Category } from '#types';

export const slashCommandData = new SlashCommandBuilder('DEV');
export const category: Category = 'tools';
export const dev = true;
