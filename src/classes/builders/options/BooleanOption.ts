import { SlashCommandBooleanOption, ApplicationCommandOptionType } from 'discord.js';
import { BaseOptionBuilder } from '#builderBases';

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBooleanOption
export class BooleanOption extends BaseOptionBuilder<SlashCommandBooleanOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Boolean, baseKey);
        this.builder = new SlashCommandBooleanOption();
    }
}
