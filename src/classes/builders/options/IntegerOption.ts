import {
    type APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
    SlashCommandIntegerOption
} from 'discord.js';
import { BaseOption } from '#options';

export class IntegerOption extends BaseOption<SlashCommandIntegerOption> {
    constructor() {
        super(ApplicationCommandOptionType.Integer);
        this.builder = new SlashCommandIntegerOption();
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

    setMinValue(num: number) {
        this.builder.setMaxValue(num);
        return this;
    }
}
