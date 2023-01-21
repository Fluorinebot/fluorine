import { BaseOptionBuilder } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandRoleOption } from 'discord.js';

export class RoleOption extends BaseOptionBuilder<SlashCommandRoleOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Role, baseKey);
        this.builder = new SlashCommandRoleOption();
    }

    toJSON() {
        return this.builder.toJSON();
    }
}
