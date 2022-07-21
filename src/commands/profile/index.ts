import { SlashCommandBuilder } from 'discord.js';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder()
    .setName('profile')
    .setNameLocalizations({ pl: 'profil' })
    .setDescription('View/set a profile')
    .setDescriptionLocalizations({ pl: 'Obejrzyj/ustaw profil' });

export const category: Category = 'tools';
