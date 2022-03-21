import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export const data = new SlashCommandBuilder().setName('tags').setDescription('Tag text for later retrieval.');

export const category: Category = 'tools';
