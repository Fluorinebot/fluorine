import type { Category } from '#types/structures';
import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';

export const data = new SlashCommandBuilder()
    .setName('case')
    .setNameLocalizations({ pl: 'kara' })
    .setDescription('Check moderation cases')
    .setDescriptionLocalizations({ pl: 'Sprawdz informacje o karze' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
    .setDMPermission(false);

export const category: Category = 'moderation';
