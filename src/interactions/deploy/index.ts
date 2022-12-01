import { SlashCommandBuilder } from 'discord.js';
import type { SlashCommandProps } from '#types';

export const slashCommandData = new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('Deploy application commands');

export const slashCommandProps: SlashCommandProps = {
    category: 'tools'
};

export const dev = true;
