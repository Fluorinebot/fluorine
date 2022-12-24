import { SlashCommandBuilder } from '#builders';
import type { Category } from '#types';
import { PermissionFlagsBits } from 'discord.js';

export const slashCommandData = new SlashCommandBuilder()
    .setName('CONFIG_NAME')
    .setDescription('CONFIG_DESCRIPTION')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false);

export const category: Category = 'tools';
