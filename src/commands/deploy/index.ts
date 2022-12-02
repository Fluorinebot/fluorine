import { SlashCommandBuilder } from 'discord.js';
import type { Category } from '#types';

export const slashCommandData = new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('Deploy application commands');

export const category: Category = 'tools';
export const dev = true;
