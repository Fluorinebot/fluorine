import { ApplicationCommandOptionType, SlashCommandNumberOption } from 'discord.js';
import { OptionWithAutocomplete } from '#builders';

export class NumberOption extends OptionWithAutocomplete<SlashCommandNumberOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Number, baseKey);
        this.builder = new SlashCommandNumberOption();
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
