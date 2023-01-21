import { BaseOptionBuilder } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandBooleanOption } from 'discord.js';

export class BooleanOption extends BaseOptionBuilder<SlashCommandBooleanOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Boolean, baseKey);
        this.builder = new SlashCommandBooleanOption();
    }

    toJSON() {
        return this.builder.toJSON();
    }
}
