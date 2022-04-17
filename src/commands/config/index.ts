import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder()
    .setName('config')
    .setNameLocalizations({ pl: 'replace_me' })
    .setDescription("Set your guild's config")
    .setDescriptionLocalizations({ pl: 'replace_me' });

export const category: Category = 'tools';
