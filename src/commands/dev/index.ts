import { SlashCommandBuilder } from '@discordjs/builders';
import type { Category } from '#types/structures';

export const data = new SlashCommandBuilder()
    .setName('dev')
    .setDescription("Commands intended to ease in Fluorine's development.");

export const category: Category = 'tools';
export const dev = true;
