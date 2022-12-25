import { ApplicationCommandOptionType, SlashCommandNumberOption } from 'discord.js';
import { BaseOption, type Choice } from '#options';

export class NumberOption extends BaseOption<SlashCommandNumberOption> {
    constructor() {
        super(ApplicationCommandOptionType.Number);
        this.builder = new SlashCommandNumberOption();
    }

    setAutocomplete(bool: boolean) {
        this.builder.setAutocomplete(bool);
        return this;
    }

    setChoices(...choices: Choice<number>[]) {
        this.builder.setChoices(...choices);
        return this;
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
