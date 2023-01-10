import { SlashCommandBuilder } from '#builders';
import type { Category } from '#types';

export const slashCommandData = new SlashCommandBuilder().setName('PROFILE.NAME').setDescription('PROFILE.DESCRIPTION');

export const category: Category = 'tools';
