import { SlashCommandBuilder } from '#builders';
import type { Category } from '#types';
import { PermissionFlagsBits } from 'discord.js';

export const slashCommandData = new SlashCommandBuilder('CASE')
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
    .setDMPermission(false);

export const category: Category = 'moderation';
