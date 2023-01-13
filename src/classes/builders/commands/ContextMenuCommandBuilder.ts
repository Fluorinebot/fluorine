import { BaseCommand } from '#builders';
import { type ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';

export class Command extends BaseCommand<ContextMenuCommandBuilder> {
    constructor(type: ApplicationCommandType.Message | ApplicationCommandType.User, baseKey: string) {
        super(type, baseKey);
        this.builder = new ContextMenuCommandBuilder().setType(type);
        this.setBaseKey(baseKey);
    }

    setDefaultMemberPermissions(permissions: bigint | string | number) {
        this.builder.setDefaultMemberPermissions(permissions);
        return this;
    }

    setDMPermission(permission: boolean) {
        this.builder.setDMPermission(permission);
        return this;
    }
}
