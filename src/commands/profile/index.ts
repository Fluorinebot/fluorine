import { SlashCommandBuilder } from '#builders';
import type { Category } from '#types';

export const slashCommandData = new SlashCommandBuilder().setName('PROFILE_NAME').setDescription('PROFILE_DESCRIPTION');

export const category: Category = 'tools';
