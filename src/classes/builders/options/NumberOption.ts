import {
    type APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
    SlashCommandNumberOption
} from 'discord.js';
import { BaseOption } from '#options';

export class NumberOption extends BaseOption<SlashCommandNumberOption> {
    constructor() {
        super(ApplicationCommandOptionType.Number);
        this.builder = new SlashCommandNumberOption();
    }

    setAutocomplete(bool: boolean) {
        this.builder.setAutocomplete(bool);
        return this;
    }

    setChoices(bool: boolean) {
        this.builder.setAutocomplete(bool);
        return this;
    }

    addChoices(...choices: APIApplicationCommandOptionChoice<number>[]) {
        this.builder.addChoices(...choices);
        return this;
    }

    setMaxValue(num: number) {
        this.builder.setMaxValue(num);
        return this;
    }

    setMinLength(num: number) {
        this.builder.setMaxValue(num);
        return this;
    }
}
