import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder()
    .setName('profile')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('View/set a profile')
    .setDescriptionLocalizations({ pl: 'replace_me' });

export const category: Category = 'tools';
