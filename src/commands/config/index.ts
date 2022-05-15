import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { Category } from 'types/structures';

export const data = new SlashCommandBuilder()
    .setName('config')
    .setNameLocalizations({ pl: 'konfiguracja' })
    .setDescription("Set your guild's config")
    .setDescriptionLocalizations({ pl: 'Zobacz konfigurację twojego serwera' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false);

export const category: Category = 'tools';
