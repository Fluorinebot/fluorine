import { Category } from '#types/structures';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('case')
    .setNameLocalizations({ pl: 'kara' })
    .setDescription('Check moderation cases')
    .setDescriptionLocalizations({ pl: 'Sprawdz informacje o karze' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
    .setDMPermission(false);

export const category: Category = 'moderation';
