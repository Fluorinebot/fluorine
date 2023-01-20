import { SlashCommandBooleanOption, ApplicationCommandOptionType } from 'discord.js';
import { BaseOption } from '#builderBases';

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBooleanOption
export class BooleanOption extends BaseOption<SlashCommandBooleanOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Boolean, baseKey);
        this.builder = new SlashCommandBooleanOption();
    }
}
