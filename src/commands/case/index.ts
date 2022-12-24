import { SlashCommandBuilder } from '#builders';
import type { Category } from '#types';
import { PermissionFlagsBits } from 'discord.js';

export const slashCommandData = new SlashCommandBuilder()
    .setName('CASE_NAME')
    .setDescription('CASE_DESCRIPTION')
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
    .setDMPermission(false);

export const category: Category = 'moderation';
