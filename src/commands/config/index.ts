import type { Category } from '#types';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const slashCommandData = new SlashCommandBuilder()
    .setName('config')
    .setNameLocalizations({ pl: 'konfiguracja' })
    .setDescription("Set your guild's config")
    .setDescriptionLocalizations({ pl: 'Zobacz konfigurację twojego serwera' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false);

export const category: Category = 'tools';
