import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder()
    .setName('config')
    .setNameLocalizations({ pl: 'konfiguracja' })
    .setDescription("Set your guild's config")
    .setDescriptionLocalizations({ pl: 'Zobacz konfigurację twojego serwera' });

export const category: Category = 'tools';
