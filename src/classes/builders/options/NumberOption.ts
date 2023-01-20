import { ApplicationCommandOptionType, SlashCommandNumberOption } from 'discord.js';
import { BaseOption } from '#builderBases';

export class NumberOption extends BaseOption<SlashCommandNumberOption> {
    choiceQueue: number[];

    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Number, baseKey);
        this.builder = new SlashCommandNumberOption();
        this.choiceQueue = [];
    }

    setMaxValue(num: number) {
        this.builder.setMaxValue(num);
        return this;
    }

    setMinValue(num: number) {
        this.builder.setMinValue(num);
        return this;
    }

    setAutocomplete(bool: boolean) {
        this.builder.setAutocomplete(bool);
        return this;
    }

    addChoices(...choices: number[]) {
        this.choiceQueue = choices;
        return this;
    }

    prepareChoices() {
        const preparedChoices = this.choiceQueue.map((value: number) => {
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
        this.builder.addChoices(...preparedChoices);
        return this;
    }
}
