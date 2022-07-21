import { Category } from 'types/structures';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('config')
    .setNameLocalizations({ pl: 'konfiguracja' })
    .setDescription("Set your guild's config")
    .setDescriptionLocalizations({ pl: 'Zobacz konfigurację twojego serwera' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false);

export const category: Category = 'tools';
