import {
    type APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
    SlashCommandStringOption
} from 'discord.js';
import { BaseOption } from '#options';

export class StringOption extends BaseOption<SlashCommandStringOption> {
    constructor() {
        super(ApplicationCommandOptionType.String);
        this.builder = new SlashCommandStringOption();
    }

    setAutocomplete(bool: boolean) {
        this.builder.setAutocomplete(bool);
        return this;
    }

    setChoices(bool: boolean) {
        this.builder.setAutocomplete(bool);
        return this;
    }

    addChoices(...choices: APIApplicationCommandOptionChoice<string>[]) {
        this.builder.addChoices(...choices);
        return this;
    }

    setMaxLength(num: number) {
        this.builder.setMaxLength(num);
        return this;
    }

    setMinLength(num: number) {
        this.builder.setMinLength(num);
        return this;
    }
}
