import { BaseBuilder } from '#builders';
import { ContextMenuCommandBuilder as UnlocalizedBuilder, type ContextMenuCommandType } from 'discord.js';

export class ContextMenuCommandBuilder extends BaseBuilder<UnlocalizedBuilder> {
    constructor(type: ContextMenuCommandType) {
        super(true, type);
        this.builder = new UnlocalizedBuilder().setType(type);
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
