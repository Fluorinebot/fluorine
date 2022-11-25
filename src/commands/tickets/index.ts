import type { Category } from '#types';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('tickets')
    .setNameLocalizations({ pl: 'tickety' })
    .setDescription('we are in the process of doing ur mom.')
    .setDescriptionLocalizations({ pl: 'idk im not that fluent at polska.' });

export const category: Category = 'tools';
