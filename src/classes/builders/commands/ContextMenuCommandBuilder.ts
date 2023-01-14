import { BaseCommand } from '#builders';
import { type ApplicationCommandType, ContextMenuCommandBuilder as UnlocalizedBuilder } from 'discord.js';

export class ContextMenuCommandBuilder extends BaseCommand<UnlocalizedBuilder> {
    constructor(type: ApplicationCommandType.Message | ApplicationCommandType.User, baseKey: string) {
        super(type, baseKey);
        this.builder = new UnlocalizedBuilder().setType(type);
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