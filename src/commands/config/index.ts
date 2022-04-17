import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder().setName('config').setDescription("Set your guild's config");

export const category: Category = 'tools';
