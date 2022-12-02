import type { Category } from '#types';
import { SlashCommandBuilder } from 'discord.js';

export const slashCommandData = new SlashCommandBuilder()
    .setName('profile')
    .setNameLocalizations({ pl: 'profil' })
    .setDescription('View/set a profile')
    .setDescriptionLocalizations({ pl: 'Obejrzyj/ustaw profil' });

export const category: Category = 'tools';
