import { SlashCommandBuilder } from '@discordjs/builders';
import type { Category } from '#types/structures';

export const data = new SlashCommandBuilder().setName('deploy').setDescription('Deploy application commands');

export const category: Category = 'tools';
export const dev = true;
