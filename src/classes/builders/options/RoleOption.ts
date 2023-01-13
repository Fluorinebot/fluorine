import { BaseOption } from '#builders';
import { ApplicationCommandOptionType, SlashCommandRoleOption } from 'discord.js';

// https://discord.js.org/#/docs/builders/main/class/SlashCommandRoleOption
export class RoleOption extends BaseOption<SlashCommandRoleOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Role, baseKey);
        this.builder = new SlashCommandRoleOption();
    }
}
