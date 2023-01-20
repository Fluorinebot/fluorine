import { BaseOptionBuilder } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandRoleOption } from 'discord.js';

// https://discord.js.org/#/docs/builders/main/class/SlashCommandRoleOption
export class RoleOption extends BaseOptionBuilder<SlashCommandRoleOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Role, baseKey);
        this.builder = new SlashCommandRoleOption();
    }
}
