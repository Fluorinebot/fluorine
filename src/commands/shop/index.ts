import { SlashCommandBuilder } from '#builders';
import type { Category } from '#types';

export const slashCommandData = new SlashCommandBuilder('SHOP').setDMPermission(false);

export const category: Category = 'economy';
