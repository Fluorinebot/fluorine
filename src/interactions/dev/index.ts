import { SlashCommandBuilder } from 'discord.js';
import type { SlashCommandProps } from '#types';

export const slashCommandData = new SlashCommandBuilder()
    .setName('dev')
    .setDescription("Commands intended to ease in Fluorine's development.");

export const slashCommandProps: SlashCommandProps = {
    category: 'tools'
};

export const dev = true;
