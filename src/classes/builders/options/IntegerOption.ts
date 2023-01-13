import { ApplicationCommandOptionType, SlashCommandIntegerOption } from 'discord.js';
import { OptionWithAutocomplete } from '#builders';

export class IntegerOption extends OptionWithAutocomplete<SlashCommandIntegerOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Integer, baseKey);
        this.builder = new SlashCommandIntegerOption();
    }

    setMaxValue(num: number) {
        this.builder.setMaxValue(num);
        return this;
    }

    setMinValue(num: number) {
        this.builder.setMinValue(num);
        return this;
    }
}
