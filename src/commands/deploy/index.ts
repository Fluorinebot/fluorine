import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder()
    .setName('deploy')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription('Deploy application commands')
    .setDescriptionLocalizations({ pl: 'replace_me' });

export const category: Category = 'tools';
export const dev = true;
