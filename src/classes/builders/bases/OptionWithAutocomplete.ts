import { BaseOption } from '#builders';
import type {
    ApplicationCommandOptionType,
    SlashCommandIntegerOption,
    SlashCommandNumberOption,
    SlashCommandStringOption
} from 'discord.js';

export class OptionWithAutocomplete<
    T extends SlashCommandIntegerOption | SlashCommandNumberOption | SlashCommandStringOption
> extends BaseOption<T> {
    choiceQueue: string[] | number[];
    constructor(type: ApplicationCommandOptionType, baseKey: string) {
        super(type, baseKey);
        this.choiceQueue = [];
    }

    setAutocomplete(bool: boolean) {
        this.builder.setAutocomplete(bool);
        return this;
    }

    addChoices(...choices: string[] | number[]) {
        this.choiceQueue = choices;
        return this;
    }

    prepareChoices() {
        const preparedChoices = this.choiceQueue.map((value: string | number) => {
            const name = this.getDefault(`${this.baseKey}.CHOICES.${value.toString().toUpperCase()}`);
            const name_localizations = this.getLocalizations(
                `${this.baseKey}.CHOICES.${value.toString().toUpperCase()}`
            );

            return {
                name,
                name_localizations,
                value
            };
        });

        this.choiceQueue = [];
        // i know this is an any but thats what you have to do when youre doing assumed types.
        this.builder.addChoices(...(preparedChoices as any[]));
        return this;
    }
}
